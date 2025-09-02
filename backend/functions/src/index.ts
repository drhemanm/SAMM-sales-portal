import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

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

// Basic auth middleware for now (we'll expand this later)
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

// Basic routes for testing
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'Meat Market Portal API'
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

// Mock customers endpoint for testing
app.get('/customers', (req: any, res) => {
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
    },
    {
      id: '2', 
      businessInfo: {
        name: 'Bella Vista Restaurant',
        type: 'restaurant'
      },
      salesInfo: {
        assignedSalesperson: req.user?.uid || 'unknown'
      },
      metrics: {
        totalOrders: 89,
        totalValue: 78500
      }
    }
  ];

  res.json({ 
    customers: mockCustomers,
    pagination: {
      page: 1,
      limit: 20,
      total: mockCustomers.length
    }
  });
});

// Mock dashboard analytics
app.get('/analytics/dashboard', (req: any, res) => {
  res.json({
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
    }
  });
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
      'GET /analytics/dashboard'
    ]
  });
});

// Export the API
export const api = functions.region('us-central1').https.onRequest(app);
