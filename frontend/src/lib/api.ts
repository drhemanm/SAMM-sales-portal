import axios from 'axios';
import { auth } from './firebase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Create axios instance
const api = axios.create({
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

export default api;

// API service functions
export const customerService = {
  getAll: (params?: any) => api.get('/customers', { params }),
  getById: (id: string) => api.get(`/customers/${id}`),
  create: (data: any) => api.post('/customers', data),
  update: (id: string, data: any) => api.put(`/customers/${id}`, data),
  delete: (id: string) => api.delete(`/customers/${id}`),
  getOrders: (id: string) => api.get(`/customers/${id}/orders`),
};

export const productService = {
  getAll: (params?: any) => api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
  updateInventory: (id: string, data: any) => api.patch(`/products/${id}/inventory`, data),
};

export const orderService = {
  getAll: (params?: any) => api.get('/orders', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  create: (data: any) => api.post('/orders', data),
  update: (id: string, data: any) => api.put(`/orders/${id}`, data),
  updateStatus: (id: string, status: string) => api.patch(`/orders/${id}/status`, { status }),
  approve: (id: string) => api.post(`/orders/${id}/approve`),
  cancel: (id: string, reason?: string) => api.post(`/orders/${id}/cancel`, { reason }),
  getTracking: (id: string) => api.get(`/orders/${id}/tracking`),
};

export const analyticsService = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getSalesMetrics: (params?: any) => api.get('/analytics/sales', { params }),
  getCustomerMetrics: (params?: any) => api.get('/analytics/customers', { params }),
  getProductMetrics: (params?: any) => api.get('/analytics/products', { params }),
  getInventoryMetrics: () => api.get('/analytics/inventory'),
};
