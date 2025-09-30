'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  TrendingUp,
  Calendar,
  Package,
  Clock,
  AlertCircle,
  User,
  Building2,
  CreditCard,
  FileText,
  Plus,
  Edit,
  MoreVertical,
} from 'lucide-react';
import MobileLayout from '@/components/MobileLayout';
import OrderCard from '@/components/OrderCard';
import { useCustomers } from '@/hooks/useCustomers';
import { customerService } from '@/lib/api';
import type { Customer, Order } from '@/types';
import { CUSTOMER_TYPES } from '@/types';

export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;

  const { getCustomerById } = useCustomers({ autoFetch: true });
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'notes'>('overview');

  useEffect(() => {
    loadCustomerData();
  }, [customerId]);

  const loadCustomerData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get customer from hook first
      let customerData = getCustomerById(customerId);

      // If not in cache, fetch from API
      if (!customerData) {
        customerData = await customerService.getById(customerId);
      }

      setCustomer(customerData);

      // Load customer orders
      loadOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customer');
      console.error('Error loading customer:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const customerOrders = await customerService.getOrders(customerId);
      setOrders(customerOrders);
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const getCustomerIcon = () => {
    const typeInfo = CUSTOMER_TYPES.find((t) => t.value === customer?.type);
    return typeInfo?.icon || '📦';
  };

  const getCustomerTypeLabel = () => {
    const typeInfo = CUSTOMER_TYPES.find((t) => t.value === customer?.type);
    return typeInfo?.label || 'Other';
  };

  const getCreditStatusColor = () => {
    if (!customer) return 'text-gray-600';
    const percentage = (customer.creditUsed / customer.creditLimit) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatLastOrder = () => {
    if (!customer?.lastOrderDate) return 'No orders yet';
    const date = new Date(customer.lastOrderDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="spinner-lg mb-4 text-rose-600"></div>
            <p className="text-gray-600 font-medium">Loading customer...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (error || !customer) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center h-full p-6">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Customer Not Found</h2>
          <p className="text-gray-600 text-center mb-6">
            {error || 'The customer you are looking for does not exist.'}
          </p>
          <button onClick={() => router.back()} className="btn-primary">
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </button>
        </div>
      </MobileLayout>
    );
  }

  const creditPercentage = (customer.creditUsed / customer.creditLimit) * 100;

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-500 text-white">
          <div className="p-6 pb-8">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => router.back()}
                className="p-3 bg-white/20 backdrop-blur-xl rounded-xl hover:bg-white/30 transition-all"
              >
                <ArrowLeft className="h-6 w-6 text-white" />
              </button>
              <div className="flex items-center gap-2">
                <button className="p-3 bg-white/20 backdrop-blur-xl rounded-xl hover:bg-white/30 transition-all">
                  <Edit className="h-5 w-5 text-white" />
                </button>
                <button className="p-3 bg-white/20 backdrop-blur-xl rounded-xl hover:bg-white/30 transition-all">
                  <MoreVertical className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            {/* Customer Info */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                {getCustomerIcon()}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-display font-bold mb-1">{customer.name}</h1>
                <p className="text-white/90 text-sm mb-2">{getCustomerTypeLabel()}</p>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-xl rounded-full text-xs font-semibold">
                    {customer.status === 'active' ? '✓ Active' : customer.status}
                  </span>
                  {customer.totalValue > 100000 && (
                    <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full text-xs font-semibold text-white shadow-lg">
                      ⭐ Premium
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-4 py-4 font-semibold text-sm transition-all ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 px-4 py-4 font-semibold text-sm transition-all ${
                activeTab === 'orders'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 px-4 py-4 font-semibold text-sm transition-all ${
                activeTab === 'notes'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Notes
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 bg-gray-50 space-y-4">
          {activeTab === 'overview' && (
            <>
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="card text-center">
                  <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{customer.totalOrders}</p>
                  <p className="text-xs text-gray-600">Total Orders</p>
                </div>
                <div className="card text-center">
                  <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    R{(customer.totalValue / 1000).toFixed(0)}k
                  </p>
                  <p className="text-xs text-gray-600">Lifetime Value</p>
                </div>
                <div className="card text-center">
                  <Package className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    R{customer.averageOrderValue.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600">Avg Order</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  {customer.phone && (
                    <a
                      href={`tel:${customer.phone}`}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <Phone className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{customer.phone}</p>
                        <p className="text-xs text-gray-600">Tap to call</p>
                      </div>
                    </a>
                  )}
                  {customer.email && (
                    <a
                      href={`mailto:${customer.email}`}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <Mail className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">
                          {customer.email}
                        </p>
                        <p className="text-xs text-gray-600">Tap to email</p>
                      </div>
                    </a>
                  )}
                  {customer.address && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {customer.address.line1}
                        </p>
                        <p className="text-xs text-gray-600">
                          {customer.address.city}, {customer.address.province}{' '}
                          {customer.address.postalCode}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Information */}
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  Financial Information
                </h3>
                <div className="space-y-4">
                  {/* Credit Status */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Credit Used</span>
                      <span className={`text-sm font-bold ${getCreditStatusColor()}`}>
                        R{customer.creditUsed.toLocaleString()} / R
                        {customer.creditLimit.toLocaleString()}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${Math.min(creditPercentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {creditPercentage.toFixed(1)}% of credit limit used
                    </p>
                  </div>

                  {/* Payment Terms */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-600">Payment Terms</span>
                    <span className="text-sm font-bold text-gray-900">
                      {customer.paymentTerms} days
                    </span>
                  </div>

                  {/* Currency */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-600">Currency</span>
                    <span className="text-sm font-bold text-gray-900">
                      {customer.currency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sales Information */}
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-600" />
                  Sales Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-600">Assigned To</span>
                    <span className="text-sm font-bold text-gray-900">
                      {customer.assignedSalespersonName}
                    </span>
                  </div>
                  {customer.territory && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm text-gray-600">Territory</span>
                      <span className="text-sm font-bold text-gray-900">
                        {customer.territory}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-600">Last Order</span>
                    <span className="text-sm font-bold text-gray-900">
                      {formatLastOrder()}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'orders' && (
            <>
              {ordersLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="spinner-lg mb-4 text-blue-600"></div>
                    <p className="text-gray-600">Loading orders...</p>
                  </div>
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <Package className="w-full h-full" />
                  </div>
                  <h3 className="empty-state-title">No Orders Yet</h3>
                  <p className="empty-state-description">
                    This customer hasn't placed any orders yet
                  </p>
                  <button
                    onClick={() => router.push('/orders/new')}
                    className="btn-primary"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Create First Order</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      compact={true}
                      showCustomer={false}
                      onClick={(order) => router.push(`/orders/${order.id}`)}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'notes' && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FileText className="w-full h-full" />
              </div>
              <h3 className="empty-state-title">No Notes Yet</h3>
              <p className="empty-state-description">
                Add notes about this customer for future reference
              </p>
              <button className="btn-primary">
                <Plus className="h-5 w-5" />
                <span>Add Note</span>
              </button>
            </div>
          )}

          {/* Bottom Padding */}
          <div className="h-4"></div>
        </div>

        {/* Action Button */}
        {activeTab === 'overview' && (
          <div className="p-4 bg-white border-t border-gray-200 safe-bottom">
            <button
              onClick={() => router.push('/orders/new')}
              className="btn-primary w-full"
            >
              <Plus className="h-5 w-5" />
              <span>Create New Order</span>
            </button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
