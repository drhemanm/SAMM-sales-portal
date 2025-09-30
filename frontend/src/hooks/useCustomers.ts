import { useState, useEffect, useCallback } from 'react';
import { customerService } from '@/lib/api';
import type { Customer, CustomersResponse } from '@/types';

interface UseCustomersOptions {
  autoFetch?: boolean;
  type?: string;
  searchQuery?: string;
}

interface UseCustomersReturn {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  source: 'odoo' | 'cache' | null;
  refresh: () => Promise<void>;
  getCustomerById: (id: string) => Customer | undefined;
  filteredCustomers: Customer[];
  setSearchQuery: (query: string) => void;
  setType: (type: string) => void;
  sortByDistance: () => void;
  sortByLastOrder: () => void;
}

export function useCustomers(options: UseCustomersOptions = {}): UseCustomersReturn {
  const { autoFetch = true, type: initialType, searchQuery: initialSearch } = options;

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [source, setSource] = useState<'odoo' | 'cache' | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch || '');
  const [type, setType] = useState<string>(initialType || 'all');
  const [sortBy, setSortBy] = useState<'distance' | 'lastOrder' | 'name'>('name');

  // Fetch customers
  const fetchCustomers = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      const response: CustomersResponse = await customerService.getAll(forceRefresh);
      
      setCustomers(response.customers);
      setLastUpdated(new Date());
      setSource(response.source);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch customers');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh function
  const refresh = useCallback(async () => {
    await fetchCustomers(true);
  }, [fetchCustomers]);

  // Get customer by ID
  const getCustomerById = useCallback((id: string): Customer | undefined => {
    return customers.find(c => c.id === id);
  }, [customers]);

  // Filtered customers
  const filteredCustomers = customers
    .filter(customer => {
      const matchesSearch = searchQuery
        ? customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.phone?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesType = type === 'all' ? true : customer.type === type;

      return matchesSearch && matchesType && customer.status === 'active';
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return (a.distance || 999) - (b.distance || 999);
        case 'lastOrder':
          if (!a.lastOrderDate) return 1;
          if (!b.lastOrderDate) return -1;
          return new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime();
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  // Sort functions
  const sortByDistance = useCallback(() => {
    setSortBy('distance');
  }, []);

  const sortByLastOrder = useCallback(() => {
    setSortBy('lastOrder');
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchCustomers();
    }
  }, [autoFetch, fetchCustomers]);

  return {
    customers,
    loading,
    error,
    lastUpdated,
    source,
    refresh,
    getCustomerById,
    filteredCustomers,
    setSearchQuery,
    setType,
    sortByDistance,
    sortByLastOrder,
  };
}
