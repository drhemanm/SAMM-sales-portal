'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  Grid3x3,
  List,
  Package,
  AlertCircle,
  RefreshCw,
  ShoppingCart,
} from 'lucide-react';
import MobileLayout from '@/components/MobileLayout';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { PRODUCT_CATEGORIES } from '@/types';
import type { Product } from '@/types';

export default function InventoryPage() {
  const router = useRouter();
  const {
    filteredProducts,
    loading,
    error,
    lastUpdated,
    source,
    refresh,
    setSearchQuery,
    setCategory,
  } = useProducts({ autoFetch: true });

  const { addItem, cartItemsCount } = useCart();

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchText(query);
    setSearchQuery(query);
  };

  // Handle category filter
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCategory(category);
    setShowFilters(false);
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  // Handle add to cart
  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    
    // Show success feedback (you can add a toast notification here)
    console.log('Added to cart:', product.name);
  };

  // Get stock status summary
  const getStockSummary = () => {
    const lowStock = filteredProducts.filter(
      (p) => p.availableStock <= p.lowStockThreshold && p.availableStock > 0
    ).length;
    const outOfStock = filteredProducts.filter((p) => p.availableStock === 0).length;
    const inStock = filteredProducts.filter(
      (p) => p.availableStock > p.lowStockThreshold
    ).length;

    return { lowStock, outOfStock, inStock };
  };

  const stockSummary = getStockSummary();

  // Format last updated time
  const getLastUpdateText = () => {
    if (!lastUpdated) return 'Never';
    
    const now = new Date();
    const diff = now.getTime() - new Date(lastUpdated).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 min ago';
    if (minutes < 60) return `${minutes} mins ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 space-y-4">
          {/* Title and Actions */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-brown">Inventory</h1>
              <p className="text-sm text-neutral-brown-light">
                {filteredProducts.length} products available
              </p>
            </div>

            {/* Cart Button */}
            {cartItemsCount > 0 && (
              <button
                onClick={() => router.push('/orders/new')}
                className="relative p-3 bg-meat-red rounded-full shadow-meat"
              >
                <ShoppingCart className="h-6 w-6 text-white" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-premium-gold rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {cartItemsCount}
                </span>
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-brown-light" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-meat focus:border-meat-red focus:ring-2 focus:ring-meat-red focus:ring-opacity-20 transition-all"
            />
          </div>

          {/* Filters and View Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-meat border-2 transition-colors ${
                showFilters || selectedCategory !== 'all'
                  ? 'border-meat-red bg-meat-red text-white'
                  : 'border-gray-300 bg-white text-neutral-brown hover:border-meat-red'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">
                {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
              </span>
            </button>

            <div className="flex items-center gap-2">
              {/* Refresh */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 hover:bg-gray-100 rounded-meat transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-5 w-5 text-neutral-brown ${
                    refreshing ? 'animate-spin' : ''
                  }`}
                />
              </button>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-meat p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white shadow-sm'
                      : 'hover:bg-gray-200'
                  }`}
                >
                  <Grid3x3 className="h-4 w-4 text-neutral-brown" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white shadow-sm'
                      : 'hover:bg-gray-200'
                  }`}
                >
                  <List className="h-4 w-4 text-neutral-brown" />
                </button>
              </div>
            </div>
          </div>

          {/* Stock Summary */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-neutral-brown-light">
                  {stockSummary.inStock} in stock
                </span>
              </div>
              {stockSummary.lowStock > 0 && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-neutral-brown-light">
                    {stockSummary.lowStock} low
                  </span>
                </div>
              )}
              {stockSummary.outOfStock > 0 && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-neutral-brown-light">
                    {stockSummary.outOfStock} out
                  </span>
                </div>
              )}
            </div>
            <span className="text-neutral-brown-light">
              Updated: {getLastUpdateText()}
              {source === 'cache' && (
                <span className="ml-1 text-yellow-600">(cached)</span>
              )}
            </span>
          </div>

          {/* Category Filter Dropdown */}
          {showFilters && (
            <div className="bg-gray-50 rounded-meat p-3 space-y-2 animate-slide-down">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`w-full text-left px-3 py-2 rounded transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-meat-red text-white font-semibold'
                    : 'hover:bg-gray-100'
                }`}
              >
                All Categories
              </button>
              {PRODUCT_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`w-full text-left px-3 py-2 rounded transition-colors ${
                    selectedCategory === category
                      ? 'bg-meat-red text-white font-semibold'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="spinner-lg mb-4"></div>
                <p className="text-neutral-brown-light">Loading products...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="card bg-red-50 border-red-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">
                    Failed to load products
                  </h3>
                  <p className="text-sm text-red-700">{error}</p>
                  <button
                    onClick={handleRefresh}
                    className="mt-3 text-sm font-semibold text-red-600 hover:underline"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid/List */}
          {!loading && !error && (
            <>
              {filteredProducts.length === 0 ? (
                // Empty State
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <Package className="w-full h-full" />
                  </div>
                  <h3 className="empty-state-title">No Products Found</h3>
                  <p className="empty-state-description">
                    {searchText
                      ? `No products match "${searchText}"`
                      : selectedCategory !== 'all'
                      ? `No products in ${selectedCategory} category`
                      : 'No products available'}
                  </p>
                  {(searchText || selectedCategory !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchText('');
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setCategory('all');
                      }}
                      className="btn-primary"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : viewMode === 'grid' ? (
                // Grid View
                <div className="grid grid-cols-1 gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      showStock={true}
                      compact={false}
                    />
                  ))}
                </div>
              ) : (
                // List View
                <div className="space-y-2">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      showStock={true}
                      compact={true}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Bottom Padding */}
          <div className="h-4"></div>
        </div>
      </div>
    </MobileLayout>
  );
}
