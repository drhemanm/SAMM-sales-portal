import { useState, useEffect, useCallback } from 'react';
import { orderService } from '@/lib/api';
import type { Order, OrdersResponse, OrderFormData, OrderSubmissionResponse } from '@/types';

interface UseOrdersOptions {
  autoFetch?: boolean;
  status?: string;
}

interface UseOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  source: 'odoo' | 'cache' | null;
  refresh: () => Promise<void>;
  createOrder: (orderData: OrderFormData) => Promise<OrderSubmissionResponse>;
  getOrderById: (id: string) => Order | undefined;
  filteredOrders: Order[];
  setStatusFilter: (status: string) => void;
  todayOrders: Order[];
  pendingOrders: Order[];
  completedOrders: Order[];
}

export function useOrders(options: UseOrdersOptions = {}): UseOrdersReturn {
  const { autoFetch = true, status: initialStatus } = options;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [source, setSource] = useState<'odoo' | 'cache' | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus || 'all');

  // Fetch orders
  const fetchOrders = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      const response: OrdersResponse = await orderService.getAll(forceRefresh);
      
      setOrders(response.orders);
      setLastUpdated(new Date());
      setSource(response.source);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh function
  const refresh = useCallback(async () => {
    await fetchOrders(true);
  }, [fetchOrders]);

  // Create new order
  const createOrder = useCallback(async (orderData: OrderFormData): Promise<OrderSubmissionResponse> => {
    try {
      setLoading(true);
      setError(null);

      const response = await orderService.create(orderData);
      
      // Refresh orders list after successful creation
      await fetchOrders(true);
      
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchOrders]);

  // Get order by ID
  const getOrderById = useCallback((id: string): Order | undefined => {
    return orders.find(o => o.id === id);
  }, [orders]);

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  });

  // Today's orders
  const todayOrders = orders.filter(order => {
    const today = new Date();
    const orderDate = new Date(order.createdAt);
    return (
      orderDate.getDate() === today.getDate() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear()
    );
  });

  // Pending orders (requires attention)
  const pendingOrders = orders.filter(order => 
    ['submitted', 'processing', 'in_transit'].includes(order.status)
  );

  // Completed orders
  const completedOrders = orders.filter(order => 
    order.status === 'delivered'
  );

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchOrders();
    }
  }, [autoFetch, fetchOrders]);

  return {
    orders,
    loading,
    error,
    lastUpdated,
    source,
    refresh,
    createOrder,
    getOrderById,
    filteredOrders,
    setStatusFilter,
    todayOrders,
    pendingOrders,
    completedOrders,
  };
}
