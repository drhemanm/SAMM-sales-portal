import { Timestamp } from 'firebase-admin/firestore';

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
    customerId?: string; // For customer users
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
  lastLogin?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Customer {
  id: string;
  businessInfo: {
    name: string;
    type: 'hotel' | 'restaurant' | 'shop' | 'butchery' | 'catering' | 'other';
    industry: string;
    registrationNumber: string;
    vatNumber: string;
    website?: string;
    description?: string;
  };
  contacts: ContactPerson[];
  addresses: Address[];
  financial: {
    creditLimit: number;
    currentCredit: number;
    paymentTerms: number; // days
    outstandingBalance: number;
    currency: string;
    bankDetails?: BankDetails;
  };
  salesInfo: {
    assignedSalesperson: string;
    territory: string;
    customerTier: 'bronze' | 'silver' | 'gold' | 'platinum';
    priceList: string;
    discountPercentage: number;
    paymentMethod: 'cash' | 'credit' | 'eft' | 'card';
  };
  metrics: {
    totalOrders: number;
    totalValue: number;
    averageOrderValue: number;
    lastOrderDate?: Timestamp;
    lifetimeValue: number;
    averageDeliveryDays: number;
  };
  preferences: {
    deliveryInstructions: string;
    preferredDeliveryTime: string;
    specialRequirements: string[];
    communicationPreference: 'email' | 'sms' | 'call';
  };
  status: 'active' | 'inactive' | 'suspended' | 'prospect';
  tags: string[];
  notes: Note[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Product {
  id: string;
  basicInfo: {
    name: string;
    description: string;
    category: string;
    subcategory: string;
    sku: string;
    barcode: string;
    brand?: string;
  };
  specifications: {
    weight: number;
    unit: 'kg' | 'g' | 'lbs' | 'pieces';
    packaging: string;
    shelfLife: number; // days
    storageTemp: string;
    origin: string;
    grade: string;
    certifications: string[];
  };
  pricing: {
    basePrice: number;
    costPrice: number;
    currency: string;
    priceList: PriceRule[];
    minimumOrderQty: number;
    bulkDiscounts: BulkDiscount[];
  };
  inventory: {
    currentStock: number;
    reservedStock: number;
    availableStock: number;
    locations: InventoryLocation[];
    reorderPoint: number;
    reorderQuantity: number;
    leadTime: number; // days
    supplier: string;
  };
  images: string[];
  documents: string[]; // certificates, spec sheets
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords: string[];
  };
  status: 'active' | 'inactive' | 'discontinued' | 'out_of_stock';
  visibility: 'public' | 'private' | 'customer_specific';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Order {
  id: string;
  orderNumber: string;
  orderInfo: {
    customerId: string;
    customerName: string;
    salespersonId: string;
    salespersonName: string;
    orderDate: Timestamp;
    requestedDeliveryDate: Timestamp;
    actualDeliveryDate?: Timestamp;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    orderType: 'standard' | 'recurring' | 'quote' | 'sample';
    source: 'portal' | 'phone' | 'email' | 'whatsapp' | 'walk_in';
  };
  items: OrderItem[];
  totals: {
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    deliveryFee: number;
    totalAmount: number;
    currency: string;
    grossWeight: number;
    netWeight: number;
  };
  delivery: {
    address: Address;
    instructions: string;
    timeSlot: string;
    driverId?: string;
    vehicleId?: string;
    trackingNumber?: string;
    deliveryMethod: 'standard' | 'express' | 'scheduled' | 'pickup';
    signature?: string;
    photos?: string[];
  };
  payment: {
    method: 'cash' | 'credit' | 'eft' | 'card';
    status: 'pending' | 'paid' | 'partial' | 'overdue';
    terms: number;
    dueDate: Timestamp;
    invoiceNumber?: string;
    receiptNumber?: string;
  };
  status: 'draft' | 'pending_approval' | 'approved' | 'processing' | 'picking' | 'packed' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'returned';
  workflow: {
    approvals: Approval[];
    statusHistory: StatusChange[];
    notifications: NotificationLog[];
  };
  quality: {
    temperatureLog: TemperatureReading[];
    qualityChecks: QualityCheck[];
    customerFeedback?: CustomerFeedback;
  };
  documents: {
    invoice?: string;
    packingSlip?: string;
    deliveryNote?: string;
    qualityCertificate?: string;
  };
  metadata: {
    tags: string[];
    notes: Note[];
    attachments: string[];
    customFields: Record<string, any>;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Supporting interfaces
export interface ContactPerson {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  mobile?: string;
  department: string;
  isPrimary: boolean;
  canPlaceOrders: boolean;
  canReceiveInvoices: boolean;
  preferredContact: 'email' | 'phone' | 'sms';
}

export interface Address {
  id: string;
  type: 'billing' | 'shipping' | 'both';
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  deliveryInstructions?: string;
  accessCode?: string;
  isDefault: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountPercentage: number;
  discountAmount: number;
  totalPrice: number;
  weight: number;
  specifications: {
    cut?: string;
    grade?: string;
    packaging?: string;
  };
  notes?: string;
}

export interface PriceRule {
  customerTier: string;
  minQuantity: number;
  price: number;
  discountPercentage: number;
  validFrom: Timestamp;
  validTo: Timestamp;
}

export interface BulkDiscount {
  minQuantity: number;
  discountPercentage: number;
  discountAmount: number;
}

export interface InventoryLocation {
  locationId: string;
  locationName: string;
  quantity: number;
  reservedQuantity: number;
  zone: string;
  temperature: number;
}

export interface Note {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  type: 'general' | 'urgent' | 'follow_up' | 'complaint' | 'compliment';
  isPrivate: boolean;
  createdAt: Timestamp;
}

export interface Approval {
  id: string;
  approverId: string;
  approverName: string;
  approverRole: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  timestamp: Timestamp;
}

export interface StatusChange {
  id: string;
  fromStatus: string;
  toStatus: string;
  changedBy: string;
  changedByName: string;
  reason?: string;
  timestamp: Timestamp;
}

export interface NotificationLog {
  id: string;
  type: 'email' | 'sms' | 'push' | 'webhook';
  recipient: string;
  subject: string;
  content: string;
  status: 'sent' | 'failed' | 'pending';
  timestamp: Timestamp;
}

export interface TemperatureReading {
  sensorId: string;
  temperature: number;
  humidity: number;
  timestamp: Timestamp;
  location: string;
}

export interface QualityCheck {
  id: string;
  checkerId: string;
  checkerName: string;
  checkType: 'visual' | 'temperature' | 'weight' | 'packaging';
  result: 'pass' | 'fail' | 'warning';
  notes?: string;
  images?: string[];
  timestamp: Timestamp;
}

export interface CustomerFeedback {
  rating: number; // 1-5
  comment?: string;
  categories: {
    productQuality: number;
    deliveryTime: number;
    customerService: number;
    packaging: number;
  };
  wouldRecommend: boolean;
  timestamp: Timestamp;
}

export interface BankDetails {
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  branchCode: string;
  swiftCode?: string;
}
