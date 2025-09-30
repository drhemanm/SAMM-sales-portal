'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Users,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Award,
  X,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import MobileLayout from '@/components/MobileLayout';
import CustomerCard from '@/components/CustomerCard';
import { useCustomers } from '@/hooks/useCustomers';
import { CUSTOMER_TYPES } from '@/types';
import type { Customer } from '@/types';

export default function CustomersPage() {
  const router = useRouter();
  const {
    filteredCustomers,
    loading,
    error,
    lastUpdated,
    source,
    refresh,
    setSearchQuery,
    setType,
    sortByDistance,
    sortByLastOrder,
  } = useCustomers({ autoFetch: true });

  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortMode, setSortMode] = useState<'name' | 'distance' | 'lastOrder'>('name');
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleSearch = (query: string) => {
    setSearchText(query);
    setSearchQuery(query);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setType(type);
    setShowFilters(false);
  };

  const handleSortChange = (mode: 'name' | 'distance' | 'lastOrder') => {
    setSortMode(mode);
    if (mode === 'distance') {
      sortByDistance();
    } else if (mode === 'lastOrder') {
      sortByLastOrder();
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleCustomerClick = (customer: Customer) => {
    router.push(`/customers/${customer.id}`);
  };

  const getCustomerStats = () => {
    const total = filteredCustomers.length;
    const active = filteredCustomers.filter(
      (c) => c.lastOrderDate && 
      new Date().getTime() - new Date(c.lastOrderDate).getTime() < 30 * 24 * 60 * 60 * 1000
    ).length;
    const premium = filteredCustomers.filter((c) => c.totalValue > 100000).length;
    const nearCredit = filteredCustomers.filter(
      (c) => (c.creditUsed / c.creditLimit) > 0.8
    ).length;

    return { total, active, premium, nearCredit };
  };

  const stats = getCustomerStats();

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
        {/* Modern Header with Gradient */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-500 text-white">
          <div className="p-6 pb-8">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-display font-bold">Customers</h1>
                  <p className="text-white/90 text-sm mt-0.5">
                    {filteredCustomers.length} customers
                  </p>
                </div>
              </div>

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl hover:bg-white/30 transition-all duration-200 active:scale-95 shadow-lg disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-6 w-6 text-white ${refreshing ? 'animate-spin' : ''}`}
                />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-300" />
              <input
                type="text"
                placeholder="Search customers..."
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

        {/* Stats & Filters */}
        <div className="bg-white border-b border-gray-100 p-4 space-y-4 shadow-sm">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 text-center border border-gray-200">
              <Users className="h-4 w-4 text-gray-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">{stats.total}</p>
              <p className="text-xxs text-gray-600 font-medium">Total</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-3 text-center border border-emerald-200">
              <TrendingUp className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-emerald-700">{stats.active}</p>
              <p className="text-xxs text-emerald-600 font-medium">Active</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-3 text-center border border-amber-200">
              <Award className="h-4 w-4 text-amber-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-amber-700">{stats.premium}</p>
              <p className="text-xxs text-amber-600 font-medium">Premium</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-3 text-center border border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-red-700">{stats.nearCredit}</p>
              <p className="text-xxs text-red-600 font-medium">Credit</p>
            </div>
          </div>

          {/* Filters and Sort */}
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
            {/* Type Filter */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                showFilters || selectedType !== 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span className="text-sm">
                {selectedType === 'all' ? 'All Types' : CUSTOMER_TYPES.find(t => t.value === selectedType)?.label}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Sort Buttons */}
            <button
              onClick={() => handleSortChange('distance')}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                sortMode === 'distance'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MapPin className="h-4 w-4" />
              <span className="text-sm">Nearest</span>
            </button>

            <button
              onClick={() => handleSortChange('lastOrder')}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                sortMode === 'lastOrder'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Recent</span>
            </button>
          </div>

          {/* Type Filter Dropdown */}
          {showFilters && (
            <div className="bg-gray-50 rounded-2xl p-3 space-y-2 animate-slide-up border border-gray-200">
              <button
                onClick={() => handleTypeChange('all')}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${
                  selectedType === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-white'
                }`}
              >
                <span className="text-2xl">📦</span>
                <span>All Types</span>
              </button>
              {CUSTOMER_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleTypeChange(type.value)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${
                    selectedType === type.value
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-white'
                  }`}
                >
                  <span className="text-2xl">{type.icon}</span>
                  <span>{type.label}</span>
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
            {sortMode !== 'name' && (
              <span className="text-blue-600 font-medium">
                Sorted by {sortMode === 'distance' ? 'distance' : 'last order'}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 bg-gray-50">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="spinner-lg mb-4 text-blue-600"></div>
                <p className="text-gray-600 font-medium">Loading customers...</p>
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
                    Failed to load customers
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

          {/* Customers List */}
          {!loading && !error && (
            <>
              {filteredCustomers.length === 0 ? (
                // Empty State
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <Users className="w-full h-full" />
                  </div>
                  <h3 className="empty-state-title">No Customers Found</h3>
                  <p className="empty-state-description">
                    {searchText
                      ? `No customers match "${searchText}"`
                      : selectedType !== 'all'
                      ? `No customers of type ${CUSTOMER_TYPES.find(t => t.value === selectedType)?.label}`
                      : 'No customers assigned to you yet'}
                  </p>
                  {(searchText || selectedType !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchText('');
                        setSearchQuery('');
                        setSelectedType('all');
                        setType('all');
                      }}
                      className="btn-primary"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                // Customer Cards
                <div className="space-y-3">
                  {filteredCustomers.map((customer) => (
                    <CustomerCard
                      key={customer.id}
                      customer={customer}
                      onClick={handleCustomerClick}
                      showDistance={sortMode === 'distance'}
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
