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
  Package,
  ChevronDown,
  X,
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

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setStatusFilter(status);
    setShowFilters(false);
  };

  const handleViewModeChange = (mode: 'all' | 'today' | 'pending' | 'completed') => {
    setViewMode(mode);
    setSelectedStatus('all');
    setStatusFilter('all');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

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

  const getOrderStats = () => {
    const total = filteredOrders.length;
    const today = todayOrders.length;
    const pending = pendingOrders.length;
    const completed = completedOrders.length;
    const todayValue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    return { total, today, pending, completed, todayValue };
  };

  const stats = getOrderStats();

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
        <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-500 text-white">
          <div className="p-6 pb-8">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg">
                  <ShoppingCart className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-display font-bold">Orders</h1>
                  <p className="text-white/90 text-sm mt-0.5">
                    {displayOrders.length} orders
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Refresh */}
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl hover:bg-white/30 transition-all duration-200 active:scale-95 shadow-lg disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-6 w-6 text-white ${refreshing ? 'animate-spin' : ''}`}
                  />
                </button>

                {/* New Order Button */}
                <button
                  onClick={() => router.push('/orders/new')}
                  className="flex items-center gap-2 px-5 py-3 bg-white text-purple-600 rounded-2xl font-semibold hover:bg-white/90 transition-all duration-200 active:scale-95 shadow-lg"
                >
                  <Plus className="h-5 w-5" />
                  <span>New</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick View Tabs */}
        <div className="bg-white border-b border-gray-100 p-4 space-y-4 shadow-sm">
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => handleViewModeChange('all')}
              className={`p-3 rounded-xl text-center transition-all ${
                viewMode === 'all'
                  ? 'bg-gradient-to-br from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <ShoppingCart className={`h-5 w-5 mx-auto mb-1 ${
                viewMode === 'all' ? 'text-white' : 'text-gray-600'
              }`} />
              <p className={`text-lg font-bold ${
                viewMode === 'all' ? 'text-white' : 'text-gray-900'
              }`}>
                {stats.total}
              </p>
              <p className={`text-xxs font-medium ${
                viewMode === 'all' ? 'text-white/90' : 'text-gray-600'
              }`}>
                All
              </p>
            </button>

            <button
              onClick={() => handleViewModeChange('today')}
              className={`p-3 rounded-xl text-center transition-all ${
                viewMode === 'today'
                  ? 'bg-gradient-to-br from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <Calendar className={`h-5 w-5 mx-auto mb-1 ${
                viewMode === 'today' ? 'text-white' : 'text-emerald-600'
              }`} />
              <p className={`text-lg font-bold ${
                viewMode === 'today' ? 'text-white' : 'text-emerald-700'
              }`}>
                {stats.today}
              </p>
              <p className={`text-xxs font-medium ${
                viewMode === 'today' ? 'text-white/90' : 'text-emerald-600'
              }`}>
                Today
              </p>
            </button>

            <button
              onClick={() => handleViewModeChange('pending')}
              className={`p-3 rounded-xl text-center transition-all ${
                viewMode === 'pending'
                  ? 'bg-gradient-to-br from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-500/25'
                  : 'bg-amber-50 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Clock className={`h-5 w-5 mx-auto mb-1 ${
                viewMode === 'pending' ? 'text-white' : 'text-amber-600'
              }`} />
              <p className={`text-lg font-bold ${
                viewMode === 'pending' ? 'text-white' : 'text-amber-700'
              }`}>
                {stats.pending}
              </p>
              <p className={`text-xxs font-medium ${
                viewMode === 'pending' ? 'text-white/90' : 'text-amber-600'
              }`}>
                Pending
              </p>
            </button>

            <button
              onClick={() => handleViewModeChange('completed')}
              className={`p-3 rounded-xl text-center transition-all ${
                viewMode === 'completed'
                  ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-blue-50 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              <CheckCircle className={`h-5 w-5 mx-auto mb-1 ${
                viewMode === 'completed' ? 'text-white' : 'text-blue-600'
              }`} />
              <p className={`text-lg font-bold ${
                viewMode === 'completed' ? 'text-white' : 'text-blue-700'
              }`}>
                {stats.completed}
              </p>
              <p className={`text-xxs font-medium ${
                viewMode === 'completed' ? 'text-white/90' : 'text-blue-600'
              }`}>
                Done
              </p>
            </button>
          </div>

          {/* Today's Value */}
          {viewMode === 'today' && stats.today > 0 && (
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/25">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6" />
                  <span className="text-sm opacity-90 font-medium">Today's Total</span>
                </div>
                <p className="text-3xl font-bold font-mono">
                  R{stats.todayValue.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Status Filter for All View */}
          {viewMode === 'all' && (
            <>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-semibold transition-all ${
                  showFilters || selectedStatus !== 'all'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Filter className="h-5 w-5" />
                  <span>
                    {selectedStatus === 'all' 
                      ? 'All Statuses' 
                      : ORDER_STATUSES.find(s => s.value === selectedStatus)?.label || selectedStatus
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedStatus)}
                  <ChevronDown className={`h-5 w-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Status Filter Dropdown */}
              {showFilters && (
                <div className="bg-gray-50 rounded-2xl p-3 space-y-2 animate-slide-up border border-gray-200">
                  <button
                    onClick={() => handleStatusChange('all')}
                    className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-between ${
                      selectedStatus === 'all'
                        ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-white'
                    }`}
                  >
                    <span>All Statuses</span>
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                  {ORDER_STATUSES.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => handleStatusChange(status.value)}
                      className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-between ${
                        selectedStatus === status.value
                          ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-white'
                      }`}
                    >
                      <span>{status.label}</span>
                      {getStatusIcon(status.value)}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Last Updated */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              Updated: {getLastUpdateText()}
              {source === 'cache' && (
                <span className="ml-1 text-amber-600 font-medium">(cached)</span>
              )}
            </span>
            {viewMode !== 'all' && (
              <span className="text-purple-600 font-medium">
                Showing {viewMode} orders
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
                <div className="spinner-lg mb-4 text-purple-600"></div>
                <p className="text-gray-600 font-medium">Loading orders...</p>
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
