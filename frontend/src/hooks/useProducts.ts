import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/lib/api';
import type { Product, ProductsResponse, StockCheckResponse } from '@/types';

interface UseProductsOptions {
  autoFetch?: boolean;
  category?: string;
  searchQuery?: string;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  source: 'odoo' | 'cache' | null;
  refresh: () => Promise<void>;
  checkStock: (productIds: string[]) => Promise<StockCheckResponse[]>;
  getProductById: (id: string) => Product | undefined;
  filteredProducts: Product[];
  setSearchQuery: (query: string) => void;
  setCategory: (category: string) => void;
}

export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
  const { autoFetch = true, category: initialCategory, searchQuery: initialSearch } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [source, setSource] = useState<'odoo' | 'cache' | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch || '');
  const [category, setCategory] = useState<string>(initialCategory || 'all');

  // Fetch products
  const fetchProducts = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      const response: ProductsResponse = await productService.getAll(forceRefresh);
      
      setProducts(response.products);
      setLastUpdated(response.lastUpdated);
      setSource(response.source);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh function (forces fresh data)
  const refresh = useCallback(async () => {
    await fetchProducts(true);
  }, [fetchProducts]);

  // Check real-time stock
  const checkStock = useCallback(async (productIds: string[]): Promise<StockCheckResponse[]> => {
    try {
      return await productService.checkStock(productIds);
    } catch (err) {
      console.error('Error checking stock:', err);
      throw err;
    }
  }, []);

  // Get product by ID
  const getProductById = useCallback((id: string): Product | undefined => {
    return products.find(p => p.id === id);
  }, [products]);

  // Filtered products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesCategory = category === 'all' ? true : product.category === category;

    return matchesSearch && matchesCategory && product.status === 'active';
  });

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
  }, [autoFetch, fetchProducts]);

  // Update last updated timestamp periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const lastUpdate = productService.getLastUpdate();
      if (lastUpdate) {
        setLastUpdated(lastUpdate);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    products,
    loading,
    error,
    lastUpdated,
    source,
    refresh,
    checkStock,
    getProductById,
    filteredProducts,
    setSearchQuery,
    setCategory,
  };
}
