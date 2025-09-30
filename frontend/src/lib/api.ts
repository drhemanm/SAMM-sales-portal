import axios, { AxiosInstance } from 'axios';
import { auth } from './firebase';
import type {
  Product,
  Customer,
  Order,
  ProductsResponse,
  CustomersResponse,
  OrdersResponse,
  StockCheckResponse,
  OrderSubmissionResponse,
  ApiResponse,
  DashboardMetrics,
  PerformanceMetrics,
  OrderFormData,
  CachedData,
  CacheMetadata,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Cache configuration
const CACHE_DURATION = {
  products: 30 * 60 * 1000,    // 30 minutes
  customers: 15 * 60 * 1000,   // 15 minutes
  orders: 5 * 60 * 1000,       // 5 minutes
  dashboard: 2 * 60 * 1000,    // 2 minutes
};

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// ==================== CACHE MANAGEMENT ====================

class CacheManager {
  private static getItem<T>(key: string): CachedData<T> | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const cached: CachedData<T> = JSON.parse(item);
      
      // Check if expired
      if (new Date(cached.metadata.expiresAt) < new Date()) {
        localStorage.removeItem(key);
        return null;
      }
      
      return cached;
    } catch (error) {
      console.error('Cache read error:', error);
      return null;
    }
  }

  private static setItem<T>(key: string, data: T, duration: number): void {
    if (typeof window === 'undefined') return;
    
    try {
      const now = new Date();
      const cached: CachedData<T> = {
        data,
        metadata: {
          key,
          timestamp: now,
          expiresAt: new Date(now.getTime() + duration),
          version: '1.0',
        },
      };
      
      localStorage.setItem(key, JSON.stringify(cached));
    } catch (error) {
      console.error('Cache write error:', error);
    }
  }

  static get<T>(key: string): T | null {
    const cached = this.getItem<T>(key);
    return cached ? cached.data : null;
  }

  static set<T>(key: string, data: T, duration: number): void {
    this.setItem(key, data, duration);
  }

  static clear(key?: string): void {
    if (typeof window === 'undefined') return;
    
    if (key) {
      localStorage.removeItem(key);
    } else {
      // Clear all cache
      const keys = Object.keys(localStorage).filter(k => k.startsWith('cache_'));
      keys.forEach(k => localStorage.removeItem(k));
    }
  }

  static getLastUpdate(key: string): Date | null {
    const cached = this.getItem<any>(key);
    return cached ? new Date(cached.metadata.timestamp) : null;
  }
}

// ==================== OFFLINE QUEUE ====================

interface QueuedRequest {
  id: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  timestamp: Date;
  retries: number;
}

class OfflineQueue {
  private static QUEUE_KEY = 'offline_queue';
  private static MAX_RETRIES = 3;

  static add(endpoint: string, method: string, data?: any): string {
    if (typeof window === 'undefined') return '';
    
    const id = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const request: QueuedRequest = {
      id,
      endpoint,
      method: method as any,
      data,
      timestamp: new Date(),
      retries: 0,
    };

    const queue = this.getQueue();
    queue.push(request);
    localStorage.setItem(this.QUEUE_KEY, JSON.stringify(queue));
    
    return id;
  }

  static getQueue(): QueuedRequest[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const queue = localStorage.getItem(this.QUEUE_KEY);
      return queue ? JSON.parse(queue) : [];
    } catch {
      return [];
    }
  }

  static remove(id: string): void {
    if (typeof window === 'undefined') return;
    
    const queue = this.getQueue().filter(req => req.id !== id);
    localStorage.setItem(this.QUEUE_KEY, JSON.stringify(queue));
  }

  static async processQueue(): Promise<void> {
    const queue = this.getQueue();
    
    for (const request of queue) {
      try {
        await api.request({
          url: request.endpoint,
          method: request.method,
          data: request.data,
        });
        
        this.remove(request.id);
      } catch (error) {
        request.retries++;
        
        if (request.retries >= this.MAX_RETRIES) {
          console.error('Max retries reached for request:', request.id);
          this.remove(request.id);
        } else {
          // Update retry count
          const queue = this.getQueue();
          const index = queue.findIndex(r => r.id === request.id);
          if (index !== -1) {
            queue[index] = request;
            localStorage.setItem(this.QUEUE_KEY, JSON.stringify(queue));
          }
        }
      }
    }
  }

  static getPendingCount(): number {
    return this.getQueue().length;
  }
}

// Process offline queue when coming back online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('Back online - processing queued requests');
    OfflineQueue.processQueue();
  });
}

// ==================== NETWORK STATUS ====================

export function isOnline(): boolean {
  if (typeof window === 'undefined') return true;
  return navigator.onLine;
}

// ==================== PRODUCTS API ====================

export const productService = {
  /**
   * Get all products with hybrid caching
   * - Returns cached data immediately
   * - Fetches fresh data in background
   */
  async getAll(forceRefresh = false): Promise<ProductsResponse> {
    const cacheKey = 'cache_products';
    
    // Return cached data if available and not forcing refresh
    if (!forceRefresh) {
      const cached = CacheManager.get<ProductsResponse>(cacheKey);
      if (cached) {
        // Return cached, but fetch fresh in background
        this.fetchAndCache(cacheKey);
        return cached;
      }
    }
    
    // No cache or forced refresh - fetch from API
    return this.fetchAndCache(cacheKey);
  },

  async fetchAndCache(cacheKey: string): Promise<ProductsResponse> {
    try {
      const response = await api.get<ProductsResponse>('/products');
      const data = response.data;
      
      // Cache the response
      CacheManager.set(cacheKey, data, CACHE_DURATION.products);
      
      return data;
    } catch (error) {
      // If offline, return cached data if available
      const cached = CacheManager.get<ProductsResponse>(cacheKey);
      if (cached) {
        return cached;
      }
      throw error;
    }
  },

  async getById(id: string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data!;
  },

  /**
   * Check real-time stock for specific products
   * ALWAYS fetches live data from Odoo - no caching
   */
  async checkStock(productIds: string[]): Promise<StockCheckResponse[]> {
    const response = await api.post<ApiResponse<StockCheckResponse[]>>(
      '/inventory/check',
      { productIds }
    );
    return response.data.data!;
  },

  /**
   * Get last cache update time
   */
  getLastUpdate(): Date | null {
    return CacheManager.getLastUpdate('cache_products');
  },
};

// ==================== CUSTOMERS API ====================

export const customerService = {
  async getAll(forceRefresh = false): Promise<CustomersResponse> {
    const cacheKey = 'cache_customers';
    
    if (!forceRefresh) {
      const cached = CacheManager.get<CustomersResponse>(cacheKey);
      if (cached) {
        this.fetchAndCache(cacheKey);
        return cached;
      }
    }
    
    return this.fetchAndCache(cacheKey);
  },

  async fetchAndCache(cacheKey: string): Promise<CustomersResponse> {
    try {
      const response = await api.get<CustomersResponse>('/customers');
      const data = response.data;
      
      CacheManager.set(cacheKey, data, CACHE_DURATION.customers);
      
      return data;
    } catch (error) {
      const cached = CacheManager.get<CustomersResponse>(cacheKey);
      if (cached) {
        return cached;
      }
      throw error;
    }
  },

  async getById(id: string): Promise<Customer> {
    const response = await api.get<ApiResponse<Customer>>(`/customers/${id}`);
    return response.data.data!;
  },

  async getOrders(id: string): Promise<Order[]> {
    const response = await api.get<ApiResponse<Order[]>>(`/customers/${id}/orders`);
    return response.data.data!;
  },

  getLastUpdate(): Date | null {
    return CacheManager.getLastUpdate('cache_customers');
  },
};

// ==================== ORDERS API ====================

export const orderService = {
  async getAll(forceRefresh = false): Promise<OrdersResponse> {
    const cacheKey = 'cache_orders';
    
    if (!forceRefresh) {
      const cached = CacheManager.get<OrdersResponse>(cacheKey);
      if (cached) {
        this.fetchAndCache(cacheKey);
        return cached;
      }
    }
    
    return this.fetchAndCache(cacheKey);
  },

  async fetchAndCache(cacheKey: string): Promise<OrdersResponse> {
    try {
      const response = await api.get<OrdersResponse>('/orders');
      const data = response.data;
      
      CacheManager.set(cacheKey, data, CACHE_DURATION.orders);
      
      return data;
    } catch (error) {
      const cached = CacheManager.get<OrdersResponse>(cacheKey);
      if (cached) {
        return cached;
      }
      throw error;
    }
  },

  async getById(id: string): Promise<Order> {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data.data!;
  },

  /**
   * Create new order
   * If offline, queues for later submission
   */
  async create(orderData: OrderFormData): Promise<OrderSubmissionResponse> {
    if (!isOnline()) {
      // Queue for later
      const queueId = OfflineQueue.add('/orders', 'POST', orderData);
      
      return {
        success: true,
        orderId: queueId,
        odooOrderId: 0,
        orderNumber: `PENDING_${queueId}`,
        message: 'Order queued - will submit when online',
        stockUpdated: false,
      };
    }

    const response = await api.post<OrderSubmissionResponse>('/orders', orderData);
    
    // Clear orders cache to force refresh
    CacheManager.clear('cache_orders');
    
    return response.data;
  },

  async updateStatus(id: string, status: string): Promise<void> {
    await api.patch(`/orders/${id}/status`, { status });
    CacheManager.clear('cache_orders');
  },

  async cancel(id: string, reason?: string): Promise<void> {
    await api.post(`/orders/${id}/cancel`, { reason });
    CacheManager.clear('cache_orders');
  },

  getLastUpdate(): Date | null {
    return CacheManager.getLastUpdate('cache_orders');
  },
};

// ==================== ANALYTICS API ====================

export const analyticsService = {
  async getDashboard(): Promise<DashboardMetrics> {
    const cacheKey = 'cache_dashboard';
    
    const cached = CacheManager.get<DashboardMetrics>(cacheKey);
    if (cached) {
      this.fetchAndCache(cacheKey);
      return cached;
    }
    
    return this.fetchAndCache(cacheKey);
  },

  async fetchAndCache(cacheKey: string): Promise<DashboardMetrics> {
    try {
      const response = await api.get<ApiResponse<DashboardMetrics>>('/analytics/dashboard');
      const data = response.data.data!;
      
      CacheManager.set(cacheKey, data, CACHE_DURATION.dashboard);
      
      return data;
    } catch (error) {
      const cached = CacheManager.get<DashboardMetrics>(cacheKey);
      if (cached) {
        return cached;
      }
      throw error;
    }
  },

  async getPerformance(period: 'daily' | 'weekly' | 'monthly'): Promise<PerformanceMetrics> {
    const response = await api.get<ApiResponse<PerformanceMetrics>>(
      `/analytics/performance?period=${period}`
    );
    return response.data.data!;
  },

  async getSalesFunnel(period: 'daily' | 'weekly' | 'monthly'): Promise<any> {
    const response = await api.get(`/analytics/sales-funnel?period=${period}`);
    return response.data;
  },
};

// ==================== UTILITY FUNCTIONS ====================

export function clearAllCache(): void {
  CacheManager.clear();
}

export function getPendingOrdersCount(): number {
  return OfflineQueue.getPendingCount();
}

export async function syncPendingOrders(): Promise<void> {
  await OfflineQueue.processQueue();
}

export function getNetworkStatus(): {
  isOnline: boolean;
  pendingRequests: number;
} {
  return {
    isOnline: isOnline(),
    pendingRequests: OfflineQueue.getPendingCount(),
  };
}

// Export axios instance for custom requests
export default api;
