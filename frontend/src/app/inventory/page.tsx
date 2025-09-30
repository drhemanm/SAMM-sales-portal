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
  Sparkles,
  TrendingUp,
  X,
  ChevronDown,
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

  const handleSearch = (query: string) => {
    setSearchText(query);
    setSearchQuery(query);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCategory(category);
    setShowFilters(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
  };

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
        {/* Modern Header with Gradient Background */}
        <div className="bg-gradient-to-br from-rose-600 via-rose-500 to-pink-500 text-white">
          <div className="p-6 pb-8">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-display font-bold">Products</h1>
                  <p className="text-white/90 text-sm mt-0.5">
                    {filteredProducts.length} items available
                  </p>
                </div>
              </div>

              {/* Cart Button */}
              {cartItemsCount > 0 && (
                <button
                  onClick={() => router.push('/orders/new')}
                  className="relative p-4 bg-white/20 backdrop-blur-xl rounded-2xl hover:bg-white/30 transition-all duration-200 active:scale-95 shadow-lg"
                >
                  <ShoppingCart className="h-6 w-6 text-white" />
                  <span className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full flex items-center justify-center text-gray-900 text-xs font-bold shadow-lg">
                    {cartItemsCount}
                  </span>
                </button>
              )}
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-rose-300" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-2xl text-white placeholder:text-white/60 focus:bg-white/30 focus:border-white/50 transition-all outline-none"
              />
              {searchText && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="bg-white border-b border-gray-100 p-4 space-y-4 shadow-sm">
          {/* Stock Summary */}
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 rounded-xl border border-emerald-200 shrink-0">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-sm font-semibold text-emerald-700">
                {stockSummary.inStock} In Stock
              </span>
            </div>
            {stockSummary.lowStock > 0 && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 rounded-xl border border-amber-200 shrink-0">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-sm font-semibold text-amber-700">
                  {stockSummary.lowStock} Low
                </span>
              </div>
            )}
            {stockSummary.outOfStock > 0 && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 rounded-xl border border-red-200 shrink-0">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-semibold text-red-700">
                  {stockSummary.outOfStock} Out
                </span>
              </div>
            )}
          </div>

          {/* Category Filter & View Toggle */}
          <div className="flex items-center gap-3">
            {/* Category Dropdown */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all flex-1 ${
                showFilters || selectedCategory !== 'all'
                  ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-lg shadow-rose-500/25'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span className="text-sm">
                {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
              </span>
              <ChevronDown className={`h-4 w-4 ml-auto transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white shadow-sm text-rose-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid3x3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-white shadow-sm text-rose-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`h-5 w-5 text-gray-700 ${refreshing ? 'animate-spin' : ''}`}
              />
            </button>
          </div>

          {/* Category Filter Dropdown */}
          {showFilters && (
            <div className="bg-gray-50 rounded-2xl p-3 space-y-2 animate-slide-up border border-gray-200">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-white'
                }`}
              >
                All Categories
              </button>
              {PRODUCT_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {/* Last Updated */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              Updated: {getLastUpdateText()}
              {source === 'cache' && (
                <span className="ml-1 text-amber-600 font-medium">(cached)</span>
              )}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 bg-gray-50">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="spinner-lg mb-4 text-rose-600"></div>
                <p className="text-gray-600 font-medium">Loading products...</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="space-y-3">
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
