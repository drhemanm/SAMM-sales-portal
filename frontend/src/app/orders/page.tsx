'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  Plus,
  RefreshCw,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Calendar,
  DollarSign,
} from 'lucide-react';
import MobileLayout from '@/components/MobileLayout';
import OrderCard from '@/components/OrderCard';
import { useOrders } from '@/hooks/useOrders';
import { ORDER_STATUSES } from '@/types';

export default function OrdersPage() {
  const router = useRouter();
  const {
    filteredOrders,
    loading,
    error,
    lastUpdated,
    source,
    refresh,
    setStatusFilter,
    todayOrders,
    pendingOrders,
    completedOrders,
  } = useOrders({ autoFetch: true });

  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'today' | 'pending' | 'completed'>('all');

  // Handle status filter
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setStatusFilter(status);
    setShowFilters(false);
  };

  // Handle view mode
  const handleViewModeChange = (mode: 'all' | 'today' | 'pending' | 'completed') => {
    setViewMode(mode);
    setSelectedStatus('all');
    setStatusFilter('all');
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  // Get orders based on view mode
  const getDisplayOrders = () => {
    switch (viewMode) {
      case 'today':
        return todayOrders;
      case 'pending':
        return pendingOrders;
      case 'completed':
        return completedOrders;
      default:
        return filteredOrders;
    }
  };

  const displayOrders = getDisplayOrders();

  // Get order stats
  const getOrderStats = () => {
    const total = filteredOrders.length;
    const today = todayOrders.length;
    const pending = pendingOrders.length;
    const completed = completedOrders.length;
    const todayValue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    return { total, today, pending, completed, todayValue };
  };

  const stats = getOrderStats();

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_transit':
        return <Truck className="h-4 w-4" />;
      case 'processing':
      case 'confirmed':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <ShoppingCart className="h-4 w-4" />;
    }
  };

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
              <h1 className="text-2xl font-bold text-neutral-brown">Orders</h1>
              <p className="text-sm text-neutral-brown-light">
                {displayOrders.length} orders
              </p>
            </div>

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

              {/* New Order */}
              <button
                onClick={() => router.push('/orders/new')}
                className="btn-primary"
              >
                <Plus className="h-5 w-5" />
                <span>New</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => handleViewModeChange('all')}
              className={`p-3 rounded-meat text-center transition-all ${
                viewMode === 'all'
                  ? 'bg-meat-red text-white shadow-meat'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <ShoppingCart className={`h-4 w-4 mx-auto mb-1 ${
                viewMode === 'all' ? 'text-white' : 'text-neutral-brown-light'
              }`} />
              <p className={`text-lg font-bold ${
                viewMode === 'all' ? 'text-white' : 'text-neutral-brown'
              }`}>
                {stats.total}
              </p>
              <p className={`text-xxs ${
                viewMode === 'all' ? 'text-white opacity-90' : 'text-neutral-brown-light'
              }`}>
                All
              </p>
            </button>

            <button
              onClick={() => handleViewModeChange('today')}
              className={`p-3 rounded-meat text-center transition-all ${
                viewMode === 'today'
                  ? 'bg-green-600 text-white shadow-meat'
                  : 'bg-green-50 hover:bg-green-100'
              }`}
            >
              <Calendar className={`h-4 w-4 mx-auto mb-1 ${
                viewMode === 'today' ? 'text-white' : 'text-green-600'
              }`} />
              <p className={`text-lg font-bold ${
                viewMode === 'today' ? 'text-white' : 'text-green-700'
              }`}>
                {stats.today}
              </p>
              <p className={`text-xxs ${
                viewMode === 'today' ? 'text-white opacity-90' : 'text-green-600'
              }`}>
                Today
              </p>
            </button>

            <button
              onClick={() => handleViewModeChange('pending')}
              className={`p-3 rounded-meat text-center transition-all ${
                viewMode === 'pending'
                  ? 'bg-yellow-600 text-white shadow-meat'
                  : 'bg-yellow-50 hover:bg-yellow-100'
              }`}
            >
              <Clock className={`h-4 w-4 mx-auto mb-1 ${
                viewMode === 'pending' ? 'text-white' : 'text-yellow-600'
              }`} />
              <p className={`text-lg font-bold ${
                viewMode === 'pending' ? 'text-white' : 'text-yellow-700'
              }`}>
                {stats.pending}
              </p>
              <p className={`text-xxs ${
                viewMode === 'pending' ? 'text-white opacity-90' : 'text-yellow-600'
              }`}>
                Pending
              </p>
            </button>

            <button
              onClick={() => handleViewModeChange('completed')}
              className={`p-3 rounded-meat text-center transition-all ${
                viewMode === 'completed'
                  ? 'bg-blue-600 text-white shadow-meat'
                  : 'bg-blue-50 hover:bg-blue-100'
              }`}
            >
              <CheckCircle className={`h-4 w-4 mx-auto mb-1 ${
                viewMode === 'completed' ? 'text-white' : 'text-blue-600'
              }`} />
              <p className={`text-lg font-bold ${
                viewMode === 'completed' ? 'text-white' : 'text-blue-700'
              }`}>
                {stats.completed}
              </p>
              <p className={`text-xxs ${
                viewMode === 'completed' ? 'text-white opacity-90' : 'text-blue-600'
              }`}>
                Done
              </p>
            </button>
          </div>

          {/* Today's Value */}
          {viewMode === 'today' && stats.today > 0 && (
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-meat p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-sm opacity-90">Today's Total</span>
                </div>
                <p className="text-2xl font-bold font-mono">
                  R{stats.todayValue.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Status Filter */}
          {viewMode === 'all' && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-meat border-2 transition-colors ${
                showFilters || selectedStatus !== 'all'
                  ? 'border-meat-red bg-meat-red text-white'
                  : 'border-gray-300 bg-white text-neutral-brown hover:border-meat-red'
              }`}
            >
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {selectedStatus === 'all' 
                    ? 'All Statuses' 
                    : ORDER_STATUSES.find(s => s.value === selectedStatus)?.label || selectedStatus
                  }
                </span>
              </div>
              {getStatusIcon(selectedStatus)}
            </button>
          )}

          {/* Status Filter Dropdown */}
          {showFilters && viewMode === 'all' && (
            <div className="bg-gray-50 rounded-meat p-3 space-y-2 animate-slide-down">
              <button
                onClick={() => handleStatusChange('all')}
                className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center justify-between ${
                  selectedStatus === 'all'
                    ? 'bg-meat-red text-white font-semibold'
                    : 'hover:bg-gray-100'
                }`}
              >
                <span>All Statuses</span>
                <ShoppingCart className="h-4 w-4" />
              </button>
              {ORDER_STATUSES.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusChange(status.value)}
                  className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center justify-between ${
                    selectedStatus === status.value
                      ? 'bg-meat-red text-white font-semibold'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span>{status.label}</span>
                  {getStatusIcon(status.value)}
                </button>
              ))}
            </div>
          )}

          {/* Last Updated */}
          <div className="flex items-center justify-between text-xs text-neutral-brown-light">
            <span>
              Updated: {getLastUpdateText()}
              {source === 'cache' && (
                <span className="ml-1 text-yellow-600">(cached)</span>
              )}
            </span>
            {viewMode !== 'all' && (
              <span className="text-meat-red font-medium">
                Showing {viewMode} orders
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="spinner-lg mb-4"></div>
                <p className="text-neutral-brown-light">Loading orders...</p>
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
                    Failed to load orders
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

          {/* Orders List */}
          {!loading && !error && (
            <>
              {displayOrders.length === 0 ? (
                // Empty State
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <ShoppingCart className="w-full h-full" />
                  </div>
                  <h3 className="empty-state-title">
                    {viewMode === 'today' && 'No Orders Today'}
                    {viewMode === 'pending' && 'No Pending Orders'}
                    {viewMode === 'completed' && 'No Completed Orders'}
                    {viewMode === 'all' && 'No Orders Found'}
                  </h3>
                  <p className="empty-state-description">
                    {viewMode === 'today' && 'Create your first order to get started'}
                    {viewMode === 'pending' && 'All orders are completed or no orders in progress'}
                    {viewMode === 'completed' && 'No delivered orders yet'}
                    {viewMode === 'all' && selectedStatus !== 'all' 
                      ? `No orders with status: ${selectedStatus}`
                      : 'Start by creating a new order'
                    }
                  </p>
                  <button
                    onClick={() => router.push('/orders/new')}
                    className="btn-primary"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Create Order</span>
                  </button>
                </div>
              ) : (
                // Order Cards
                <div className="space-y-3">
                  {displayOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      compact={true}
                      showCustomer={true}
                      onClick={(order) => router.push(`/orders/${order.id}`)}
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
