import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import axios from 'axios';

// Initialize Firebase Admin
admin.initializeApp();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: true }));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic auth middleware
const basicAuth = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
    }
    next();
  } catch (error) {
    next();
  }
};

app.use(basicAuth);

// Odoo API Configuration
const ODOO_CONFIG = {
  url: process.env.ODOO_URL || 'https://your-client-odoo.com',
  db: process.env.ODOO_DB || 'your_database',
  username: process.env.ODOO_USERNAME,
  password: process.env.ODOO_PASSWORD
};

// Odoo API Helper Class
class OdooAPI {
  private sessionId: string | null = null;

  async authenticate() {
    try {
      const response = await axios.post(`${ODOO_CONFIG.url}/web/session/authenticate`, {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          db: ODOO_CONFIG.db,
          login: ODOO_CONFIG.username,
          password: ODOO_CONFIG.password
        }
      });

      if (response.data.result && response.data.result.uid) {
        this.sessionId = response.data.result.session_id;
        return response.data.result;
      }
      throw new Error('Authentication failed');
    } catch (error) {
      console.error('Odoo authentication error:', error);
      throw error;
    }
  }

  async callMethod(model: string, method: string, params: any[] = []) {
    if (!this.sessionId) {
      await this.authenticate();
    }

    try {
      const response = await axios.post(`${ODOO_CONFIG.url}/web/dataset/call_kw`, {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          model,
          method,
          args: params,
          kwargs: {}
        }
      }, {
        headers: {
          'Cookie': `session_id=${this.sessionId}`
        }
      });

      return response.data.result;
    } catch (error) {
      console.error('Odoo API call error:', error);
      throw error;
    }
  }

  async searchRead(model: string, domain: any[] = [], fields: string[] = []) {
    return this.callMethod(model, 'search_read', [domain, fields]);
  }
}

const odooAPI = new OdooAPI();

// Get current user's Odoo profile and role
async function getOdooUserProfile(firebaseUid: string) {
  try {
    // First check if user mapping exists in Firebase
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(firebaseUid)
      .get();

    if (!userDoc.exists) {
      throw new Error('User profile not found');
    }

    const userData = userDoc.data();
    const odooUserId = userData?.odooUserId;

    if (!odooUserId) {
      throw new Error('User not linked to Odoo');
    }

    // Get user details from Odoo
    const odooUser = await odooAPI.searchRead('res.users', 
      [['id', '=', odooUserId]], 
      ['name', 'login', 'groups_id', 'partner_id']
    );

    if (!odooUser || odooUser.length === 0) {
      throw new Error('Odoo user not found');
    }

    return {
      firebaseUser: userData,
      odooUser: odooUser[0]
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
}

// Helper functions
function getUserRole(groupIds: number[]): string {
  if (groupIds.includes(1)) return 'admin';
  if (groupIds.includes(13)) return 'sales_manager';
  if (groupIds.includes(14)) return 'salesperson';
  return 'customer';
}

function mapOdooState(state: string): string {
  const stateMap: { [key: string]: string } = {
    'draft': 'draft',
    'sent': 'pending_approval',
    'sale': 'processing',
    'done': 'delivered',
    'cancel': 'cancelled'
  };
  return stateMap[state] || state;
}

function mapOdooPriority(priority: string): string {
  const priorityMap: { [key: string]: string } = {
    '0': 'low',
    '1': 'normal',
    '2': 'high',
    '3': 'urgent'
  };
  return priorityMap[priority] || 'normal';
}

function getCategoryType(categoryIds: any[]): string {
  // Map Odoo partner categories to your business types
  if (!categoryIds || categoryIds.length === 0) return 'other';
  
  // This would need to be customized based on client's Odoo categories
  return 'restaurant'; // Default
}

async function getCustomerCount(domain: any[]): Promise<number> {
  try {
    const customers = await odooAPI.searchRead('res.partner',
      [
        ['is_company', '=', true],
        ['customer_rank', '>', 0],
        ...domain
      ],
      ['id']
    );
    return customers.length;
  } catch (error) {
    console.error('Error getting customer count:', error);
    return 0;
  }
}

// Basic health check route (fallback)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    service: 'Meat Market Portal API with Odoo Integration',
    odooConfigured: !!(ODOO_CONFIG.url && ODOO_CONFIG.username)
  });
});

// Test authenticated route
app.get('/test-auth', (req: any, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.json({ 
    message: 'Authentication working!', 
    user: {
      uid: req.user.uid,
      email: req.user.email
    }
  });
});

// Get customers based on salesperson assignment in Odoo
app.get('/customers', async (req: any, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Fallback to mock data if Odoo not configured
    if (!ODOO_CONFIG.username || !ODOO_CONFIG.password) {
      const mockCustomers = [
        {
          id: '1',
          businessInfo: {
            name: 'The Grand Hotel',
            type: 'hotel'
          },
          salesInfo: {
            assignedSalesperson: req.user?.uid || 'unknown'
          },
          metrics: {
            totalOrders: 156,
            totalValue: 125000
          }
        }
      ];
      return res.json({ customers: mockCustomers, source: 'mock' });
    }

    const { firebaseUser, odooUser } = await getOdooUserProfile(req.user.uid);
    
    let domain = [];
    
    // Check if user is a salesperson in Odoo
    const isAdmin = odooUser.groups_id.includes(1); // Base.group_system
    const isSalesManager = odooUser.groups_id.includes(13); // Sales.group_sale_manager
    const isSalesperson = odooUser.groups_id.includes(14); // Sales.group_sale_salesman

    if (!isAdmin && !isSalesManager && isSalesperson) {
      // Salesperson only sees assigned customers
      domain = [['user_id', '=', odooUser.id]];
    }
    
    const customers = await odooAPI.searchRead('res.partner', 
      [
        ['is_company', '=', true],
        ['customer_rank', '>', 0],
        ...domain
      ],
      [
        'name', 'email', 'phone', 'street', 'city', 'country_id',
        'user_id', 'category_id', 'credit_limit', 'total_invoiced',
        'sale_order_count'
      ]
    );

    // Transform Odoo data to match your frontend interface
    const transformedCustomers = customers.map((customer: any) => ({
      id: customer.id.toString(),
      businessInfo: {
        name: customer.name,
        type: getCategoryType(customer.category_id),
        industry: 'Food Service', // Default for meat market
        email: customer.email,
        phone: customer.phone
      },
      addresses: [{
        type: 'billing',
        line1: customer.street,
        city: customer.city,
        country: customer.country_id ? customer.country_id[1] : '',
        isDefault: true
      }],
      financial: {
        creditLimit: customer.credit_limit,
        totalInvoiced: customer.total_invoiced
      },
      salesInfo: {
        assignedSalesperson: customer.user_id ? customer.user_id[1] : '',
        assignedSalespersonId: customer.user_id ? customer.user_id[0] : null
      },
      metrics: {
        totalOrders: customer.sale_order_count,
        totalValue: customer.total_invoiced
      }
    }));

    res.json({
      customers: transformedCustomers,
      userRole: getUserRole(odooUser.groups_id),
      source: 'odoo',
      pagination: {
        page: 1,
        limit: customers.length,
        total: customers.length
      }
    });

  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get orders from Odoo
app.get('/orders', async (req: any, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Fallback to mock data if Odoo not configured
    if (!ODOO_CONFIG.username || !ODOO_CONFIG.password) {
      return res.json({ orders: [], source: 'mock' });
    }

    const { firebaseUser, odooUser } = await getOdooUserProfile(req.user.uid);
    
    let domain = [];
    
    const isAdmin = odooUser.groups_id.includes(1);
    const isSalesManager = odooUser.groups_id.includes(13);
    const isSalesperson = odooUser.groups_id.includes(14);

    if (!isAdmin && !isSalesManager && isSalesperson) {
      // Salesperson only sees their orders
      domain = [['user_id', '=', odooUser.id]];
    }
    
    const orders = await odooAPI.searchRead('sale.order',
      [
        ['state', 'in', ['draft', 'sent', 'sale', 'done']],
        ...domain
      ],
      [
        'name', 'partner_id', 'user_id', 'amount_total', 'state',
        'date_order', 'commitment_date', 'order_line', 'priority'
      ]
    );

    const transformedOrders = orders.map((order: any) => ({
      id: order.name,
      orderNumber: order.name,
      orderInfo: {
        customerId: order.partner_id[0].toString(),
        customerName: order.partner_id[1],
        salespersonId: order.user_id[0].toString(),
        salespersonName: order.user_id[1],
        orderDate: new Date(order.date_order),
        requestedDeliveryDate: order.commitment_date ? new Date(order.commitment_date) : null,
        priority: mapOdooPriority(order.priority)
      },
      totals: {
        totalAmount: order.amount_total,
        currency: 'ZAR' // Assuming South African Rand
      },
      status: mapOdooState(order.state),
      items: order.order_line ? order.order_line.length : 0
    }));

    res.json({ 
      orders: transformedOrders.slice(0, 50), // Limit for performance
      source: 'odoo'
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Dashboard analytics from Odoo data
app.get('/analytics/dashboard', async (req: any, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Fallback to mock data if Odoo not configured
    if (!ODOO_CONFIG.username || !ODOO_CONFIG.password) {
      return res.json({
        today: {
          sales: 87450,
          orders: 23,
          customers: 8,
          avgOrderValue: 3800
        },
        thisMonth: {
          sales: 2340000,
          orders: 645,
          customers: 187,
          growth: 12.5
        },
        targets: {
          monthly: 2500000,
          quarterly: 7200000,
          achievement: 93.6
        },
        userInfo: {
          name: 'Demo User',
          role: 'salesperson'
        },
        source: 'mock'
      });
    }

    const { firebaseUser, odooUser } = await getOdooUserProfile(req.user.uid);
    
    let domain = [];
    const isAdmin = odooUser.groups_id.includes(1);
    const isSalesManager = odooUser.groups_id.includes(13);
    
    if (!isAdmin && !isSalesManager) {
      domain = [['user_id', '=', odooUser.id]];
    }

    // Get today's orders
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = await odooAPI.searchRead('sale.order',
      [
        ['date_order', '>=', today],
        ['state', 'in', ['sale', 'done']],
        ...domain
      ],
      ['amount_total']
    );

    // Get this month's orders
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const monthOrders = await odooAPI.searchRead('sale.order',
      [
        ['date_order', '>=', startOfMonth.toISOString().split('T')[0]],
        ['state', 'in', ['sale', 'done']],
        ...domain
      ],
      ['amount_total']
    );

    const todaySales = todayOrders.reduce((sum: number, order: any) => sum + order.amount_total, 0);
    const monthSales = monthOrders.reduce((sum: number, order: any) => sum + order.amount_total, 0);

    res.json({
      today: {
        sales: todaySales,
        orders: todayOrders.length,
        customers: await getCustomerCount(domain),
        avgOrderValue: todayOrders.length > 0 ? todaySales / todayOrders.length : 0
      },
      thisMonth: {
        sales: monthSales,
        orders: monthOrders.length,
        growth: 12.5 // Calculate real growth from historical data
      },
      targets: {
        monthly: 2500000, // Get from Odoo CRM targets
        quarterly: 7200000,
        achievement: (monthSales / 2500000) * 100
      },
      userInfo: {
        name: odooUser.name,
        role: getUserRole(odooUser.groups_id),
        odooId: odooUser.id
      },
      source: 'odoo'
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Error handling middleware
app.use((error: any, req: any, res: any, next: any) => {
  functions.logger.error('API Error:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    userId: req.user?.uid
  });

  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 ? 'Internal server error' : error.message;

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /health',
      'GET /test-auth', 
      'GET /customers',
      'GET /orders',
      'GET /analytics/dashboard'
    ]
  });
});

// Export the API
export const api = functions.region('us-central1').https.onRequest(app);
