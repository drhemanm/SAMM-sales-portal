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

  // Handle search
  const handleSearch = (query: string) => {
    setSearchText(query);
    setSearchQuery(query);
  };

  // Handle type filter
  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setType(type);
    setShowFilters(false);
  };

  // Handle sort change
  const handleSortChange = (mode: 'name' | 'distance' | 'lastOrder') => {
    setSortMode(mode);
    if (mode === 'distance') {
      sortByDistance();
    } else if (mode === 'lastOrder') {
      sortByLastOrder();
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  // Handle customer click
  const handleCustomerClick = (customer: Customer) => {
    router.push(`/customers/${customer.id}`);
  };

  // Get customer stats
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
          {/* Title */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-brown">My Customers</h1>
              <p className="text-sm text-neutral-brown-light">
                {filteredCustomers.length} customers assigned to you
              </p>
            </div>

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
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-gray-50 rounded-meat p-3 text-center">
              <Users className="h-4 w-4 text-neutral-brown-light mx-auto mb-1" />
              <p className="text-lg font-bold text-neutral-brown">{stats.total}</p>
              <p className="text-xxs text-neutral-brown-light">Total</p>
            </div>
            <div className="bg-green-50 rounded-meat p-3 text-center">
              <TrendingUp className="h-4 w-4 text-green-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-green-700">{stats.active}</p>
              <p className="text-xxs text-green-600">Active</p>
            </div>
            <div className="bg-yellow-50 rounded-meat p-3 text-center">
              <Award className="h-4 w-4 text-yellow-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-yellow-700">{stats.premium}</p>
              <p className="text-xxs text-yellow-600">Premium</p>
            </div>
            <div className="bg-red-50 rounded-meat p-3 text-center">
              <AlertCircle className="h-4 w-4 text-red-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-red-700">{stats.nearCredit}</p>
              <p className="text-xxs text-red-600">Credit</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-brown-light" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-meat focus:border-meat-red focus:ring-2 focus:ring-meat-red focus:ring-opacity-20 transition-all"
            />
          </div>

          {/* Filters and Sort */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {/* Type Filter */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-meat border-2 whitespace-nowrap transition-colors ${
                showFilters || selectedType !== 'all'
                  ? 'border-meat-red bg-meat-red text-white'
                  : 'border-gray-300 bg-white text-neutral-brown hover:border-meat-red'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">
                {selectedType === 'all' ? 'All Types' : selectedType}
              </span>
            </button>

            {/* Sort Buttons */}
            <button
              onClick={() => handleSortChange('distance')}
              className={`flex items-center gap-2 px-4 py-2 rounded-meat border-2 whitespace-nowrap transition-colors ${
                sortMode === 'distance'
                  ? 'border-meat-red bg-meat-red text-white'
                  : 'border-gray-300 bg-white text-neutral-brown hover:border-meat-red'
              }`}
            >
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">Nearest</span>
            </button>

            <button
              onClick={() => handleSortChange('lastOrder')}
              className={`flex items-center gap-2 px-4 py-2 rounded-meat border-2 whitespace-nowrap transition-colors ${
                sortMode === 'lastOrder'
                  ? 'border-meat-red bg-meat-red text-white'
                  : 'border-gray-300 bg-white text-neutral-brown hover:border-meat-red'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">Recent</span>
            </button>
          </div>

          {/* Last Updated */}
          <div className="flex items-center justify-between text-xs text-neutral-brown-light">
            <span>
              Updated: {getLastUpdateText()}
              {source === 'cache' && (
                <span className="ml-1 text-yellow-600">(cached)</span>
              )}
            </span>
            {sortMode !== 'name' && (
              <span className="text-meat-red font-medium">
                Sorted by {sortMode === 'distance' ? 'distance' : 'last order'}
              </span>
            )}
          </div>

          {/* Type Filter Dropdown */}
          {showFilters && (
            <div className="bg-gray-50 rounded-meat p-3 space-y-2 animate-slide-down">
              <button
                onClick={() => handleTypeChange('all')}
                className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center gap-2 ${
                  selectedType === 'all'
                    ? 'bg-meat-red text-white font-semibold'
                    : 'hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">📦</span>
                <span>All Types</span>
              </button>
              {CUSTOMER_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleTypeChange(type.value)}
                  className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center gap-2 ${
                    selectedType === type.value
                      ? 'bg-meat-red text-white font-semibold'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{type.icon}</span>
                  <span>{type.label}</span>
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
                <p className="text-neutral-brown-light">Loading customers...</p>
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
                      ? `No customers of type ${selectedType}`
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
