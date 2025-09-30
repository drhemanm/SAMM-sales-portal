// User Types
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'sales_manager' | 'salesperson' | 'customer';
  profile: {
    firstName: string;
    lastName: string;
    phone: string;
    avatar?: string;
    territory?: string;
    permissions: string[];
    odooUserId?: number;
  };
  settings: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    preferences: {
      theme: 'light' | 'dark';
      language: string;
      currency: string;
    };
  };
  status: 'active' | 'inactive' | 'suspended';
}

// Product Types
export interface Product {
  id: string;
  odooId: number;
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  sku: string;
  barcode?: string;
  
  // Pricing (fixed for all customers)
  price: number;
  unit: 'kg' | 'g' | 'lbs' | 'pieces' | 'box';
  currency: string;
  
  // Inventory
  stock: number;
  availableStock: number;
  reservedStock?: number;
  lowStockThreshold: number;
  
  // Specifications (Meat-specific)
  temperature?: string;
  temperatureMin?: number;
  temperatureMax?: number;
  grade?: 'Grade A' | 'Grade B' | 'Premium' | 'Standard';
  shelfLife?: number; // days
  weight?: number;
  origin?: string;
  
  // Display
  image?: string;
  icon?: string; // emoji fallback
  
  // Metadata
  status: 'active' | 'inactive' | 'out_of_stock';
  lastUpdated?: Date;
}

// Customer Types
export interface Customer {
  id: string;
  odooId: number;
  name: string;
  type: 'hotel' | 'restaurant' | 'shop' | 'butchery' | 'catering' | 'retail' | 'other';
  
  // Contact Info (Read-only)
  email?: string;
  phone?: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  
  // Financial (Read-only)
  creditLimit: number;
  creditUsed: number;
  creditAvailable: number;
  paymentTerms: number; // days
  currency: string;
  
  // Sales Info
  assignedSalespersonId: string;
  assignedSalespersonName: string;
  territory?: string;
  
  // History
  lastOrderDate?: Date;
  totalOrders: number;
  totalValue: number;
  averageOrderValue: number;
  
  // Location (for mobile)
  distance?: number; // km from current location
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  
  // Status
  status: 'active' | 'inactive' | 'suspended';
}

// Order Types
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  
  // Discount (0-10%, set by salesperson)
  discountPercent: number;
  discountAmount: number;
  
  // Totals
  subtotal: number;
  total: number;
  
  // Product info snapshot
  temperature?: string;
  grade?: string;
}

export interface Signature {
  imageUrl?: string;
  imageData?: string; // base64 for offline
  name: string;
  timestamp: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  odooId?: number;
  
  // Customer Info
  customerId: string;
  customerName: string;
  customerType: string;
  
  // Salesperson Info
  salespersonId: string;
  salespersonName: string;
  
  // Items
  items: OrderItem[];
  
  // Totals
  subtotal: number;
  totalDiscount: number;
  totalAmount: number;
  currency: string;
  
  // Delivery
  deliveryDate: Date;
  deliveryAddress?: string;
  specialInstructions?: string;
  
  // Signatures
  signatures?: {
    salesperson?: Signature;
    customer?: Signature;
  };
  
  // Status
  status: 'draft' | 'submitted' | 'confirmed' | 'processing' | 'in_transit' | 'delivered' | 'cancelled';
  
  // Timestamps
  createdAt: Date;
  submittedAt?: Date;
  confirmedAt?: Date;
  deliveredAt?: Date;
  
  // Sync status (for offline)
  syncStatus?: 'synced' | 'pending' | 'failed';
  lastSyncAttempt?: Date;
}

// Cart Item (before order submission)
export interface CartItem extends OrderItem {
  availableStock: number; // for validation
}

// Analytics & KPI Types
export interface DashboardMetrics {
  today: {
    target: number;
    sales: number;
    orders: number;
    visits: number;
    completed: number;
  };
  thisWeek: {
    target: number;
    sales: number;
    orders: number;
    achievement: number; // percentage
  };
  thisMonth: {
    target: number;
    sales: number;
    orders: number;
    newCustomers: number;
    achievement: number;
  };
}

export interface KPI {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
  achievement: number; // percentage
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'warning' | 'danger';
}

export interface SalesFunnel {
  prospects: number;
  contacted: number;
  quoted: number;
  closed: number;
  totalRevenue: number;
}

// Discount Options (from Odoo)
export interface DiscountOption {
  value: number; // percentage (1-10)
  label: string; // "1% Off", "2% Off", etc.
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface ProductsResponse {
  products: Product[];
  lastUpdated: Date;
  source: 'odoo' | 'cache';
}

export interface CustomersResponse {
  customers: Customer[];
  total: number;
  source: 'odoo' | 'cache';
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  source: 'odoo' | 'cache';
}

export interface StockCheckResponse {
  productId: string;
  available: number;
  reserved: number;
  lastUpdated: Date;
}

export interface OrderSubmissionResponse {
  success: boolean;
  orderId: string;
  odooOrderId: number;
  orderNumber: string;
  message: string;
  stockUpdated: boolean;
}

// Alert/Notification Types
export interface Alert {
  id: string;
  type: 'stock' | 'delivery' | 'order' | 'customer' | 'system';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

// Filter & Search Types
export interface ProductFilter {
  category?: string;
  minStock?: number;
  maxStock?: number;
  searchQuery?: string;
  inStock?: boolean;
}

export interface CustomerFilter {
  type?: string;
  territory?: string;
  searchQuery?: string;
  maxDistance?: number; // km
  status?: string;
}

export interface OrderFilter {
  status?: string;
  customerId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
}

// App State Types
export interface AppState {
  isOnline: boolean;
  lastSync?: Date;
  pendingOrders: number;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

// Cache Types
export interface CacheMetadata {
  key: string;
  timestamp: Date;
  expiresAt: Date;
  version: string;
}

export interface CachedData<T> {
  data: T;
  metadata: CacheMetadata;
}

// Form Types
export interface OrderFormData {
  customerId: string;
  customerName: string;
  items: CartItem[];
  deliveryDate: Date;
  specialInstructions: string;
  signatures: {
    salesperson?: Signature;
    customer?: Signature;
  };
}

// Validation Types
export interface ValidationError {
  field: string;
  message: string;
}

export interface OrderValidation {
  isValid: boolean;
  errors: ValidationError[];
  warnings: string[];
}

// Stock Alert Type
export interface StockAlert {
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
  severity: 'low' | 'critical' | 'out';
}

// Performance Metrics
export interface PerformanceMetrics {
  period: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  
  sales: {
    target: number;
    achieved: number;
    percentage: number;
  };
  
  orders: {
    target: number;
    achieved: number;
    percentage: number;
  };
  
  customers: {
    newCustomers: number;
    activeCustomers: number;
    retentionRate: number;
  };
  
  products: {
    topProducts: Array<{
      productId: string;
      productName: string;
      quantity: number;
      revenue: number;
    }>;
  };
  
  kpis: KPI[];
}

// Location Types (for GPS features)
export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: Date;
}

export interface RouteInfo {
  distance: number; // km
  duration: number; // minutes
  waypoints: Location[];
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  direction: SortDirection;
}

// Temperature ranges for products
export const TEMPERATURE_RANGES = {
  frozen: { min: -25, max: -18, label: 'Frozen (-18°C)' },
  chilled: { min: 0, max: 4, label: 'Chilled (0-4°C)' },
  ambient: { min: 15, max: 25, label: 'Room Temp' },
} as const;

// Grade options
export const GRADE_OPTIONS = [
  'Grade A',
  'Grade B',
  'Premium',
  'Standard',
] as const;

// Discount percentages (salesperson can select)
export const DISCOUNT_PERCENTAGES = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
] as const;

// Customer types
export const CUSTOMER_TYPES = [
  { value: 'hotel', label: 'Hotel', icon: '🏨' },
  { value: 'restaurant', label: 'Restaurant', icon: '🍽️' },
  { value: 'shop', label: 'Shop', icon: '🏪' },
  { value: 'butchery', label: 'Butchery', icon: '🥩' },
  { value: 'catering', label: 'Catering', icon: '🍴' },
  { value: 'retail', label: 'Retail', icon: '🛒' },
  { value: 'other', label: 'Other', icon: '📦' },
] as const;

// Order statuses
export const ORDER_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'gray' },
  { value: 'submitted', label: 'Submitted', color: 'blue' },
  { value: 'confirmed', label: 'Confirmed', color: 'green' },
  { value: 'processing', label: 'Processing', color: 'yellow' },
  { value: 'in_transit', label: 'In Transit', color: 'purple' },
  { value: 'delivered', label: 'Delivered', color: 'green' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' },
] as const;

// Product categories
export const PRODUCT_CATEGORIES = [
  'Beef',
  'Poultry',
  'Pork',
  'Lamb',
  'Veal',
  'Game',
  'Processed',
  'Seafood',
  'Other',
] as const;
