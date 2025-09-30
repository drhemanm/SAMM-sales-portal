'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  Download,
  Share2,
  MoreVertical,
  Thermometer,
  Award,
} from 'lucide-react';
import MobileLayout from '@/components/MobileLayout';
import { useOrders } from '@/hooks/useOrders';
import { orderService } from '@/lib/api';
import type { Order } from '@/types';
import { ORDER_STATUSES } from '@/types';

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const { getOrderById } = useOrders({ autoFetch: true });
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'items' | 'tracking'>('details');

  useEffect(() => {
    loadOrderData();
  }, [orderId]);

  const loadOrderData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get order from hook first
      let orderData = getOrderById(orderId);

      // If not in cache, fetch from API
      if (!orderData) {
        orderData = await orderService.getById(orderId);
      }

      setOrder(orderData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order');
      console.error('Error loading order:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = () => {
    if (!order) return null;
    return ORDER_STATUSES.find((s) => s.value === order.status) || {
      value: order.status,
      label: 'Unknown',
      color: 'gray',
    };
  };

  const getStatusIcon = () => {
    if (!order) return null;
    switch (order.status) {
      case 'delivered':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'in_transit':
        return <Truck className="h-6 w-6 text-blue-500" />;
      case 'processing':
      case 'confirmed':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Package className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusBadgeClass = () => {
    const statusInfo = getStatusInfo();
    if (!statusInfo) return 'bg-gray-100 text-gray-800';

    switch (statusInfo.color) {
      case 'green':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'blue':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'red':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'purple':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateTime = (date: Date) => {
    return `${formatDate(date)} at ${formatTime(date)}`;
  };

  if (loading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="spinner-lg mb-4 text-purple-600"></div>
            <p className="text-gray-600 font-medium">Loading order...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (error || !order) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center h-full p-6">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 text-center mb-6">
            {error || 'The order you are looking for does not exist.'}
          </p>
          <button onClick={() => router.back()} className="btn-primary">
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </button>
        </div>
      </MobileLayout>
    );
  }

  const statusInfo = getStatusInfo();

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-500 text-white">
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
                  <Share2 className="h-5 w-5 text-white" />
                </button>
                <button className="p-3 bg-white/20 backdrop-blur-xl rounded-xl hover:bg-white/30 transition-all">
                  <Download className="h-5 w-5 text-white" />
                </button>
                <button className="p-3 bg-white/20 backdrop-blur-xl rounded-xl hover:bg-white/30 transition-all">
                  <MoreVertical className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            {/* Order Info */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg">
                {getStatusIcon()}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-display font-bold mb-1">{order.orderNumber}</h1>
                <p className="text-white/90 text-sm mb-2">
                  {formatDateTime(order.createdAt)}
                </p>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1.5 backdrop-blur-xl rounded-full text-xs font-bold border-2 ${getStatusBadgeClass()}`}>
                    {statusInfo?.label}
                  </span>
                  {order.syncStatus === 'pending' && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold border border-yellow-200">
                      Syncing...
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className="mt-6 p-4 bg-white/20 backdrop-blur-xl rounded-2xl">
              <p className="text-white/80 text-sm mb-1">Total Amount</p>
              <p className="text-4xl font-bold font-mono">R{order.totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 px-4 py-4 font-semibold text-sm transition-all ${
                activeTab === 'details'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('items')}
              className={`flex-1 px-4 py-4 font-semibold text-sm transition-all ${
                activeTab === 'items'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Items ({order.items.length})
            </button>
            <button
              onClick={() => setActiveTab('tracking')}
              className={`flex-1 px-4 py-4 font-semibold text-sm transition-all ${
                activeTab === 'tracking'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tracking
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 bg-gray-50 space-y-4">
          {activeTab === 'details' && (
            <>
              {/* Customer Information */}
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Customer Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-600">Name</span>
                    <span className="text-sm font-bold text-gray-900">
                      {order.customerName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-600">Type</span>
                    <span className="text-sm font-bold text-gray-900 capitalize">
                      {order.customerType}
                    </span>
                  </div>
                  <button
                    onClick={() => router.push(`/customers/${order.customerId}`)}
                    className="w-full px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-semibold hover:bg-blue-100 transition-colors"
                  >
                    View Customer Profile
                  </button>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Delivery Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Delivery Date</span>
                    </div>
                    <span className="text-sm font-bold text-green-700">
                      {formatDate(order.deliveryDate)}
                    </span>
                  </div>
                  {order.deliveryAddress && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      <MapPin className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Delivery Address
                        </p>
                        <p className="text-sm text-gray-700">{order.deliveryAddress}</p>
                      </div>
                    </div>
                  )}
                  {order.specialInstructions && (
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-yellow-900 mb-1">
                          Special Instructions
                        </p>
                        <p className="text-sm text-yellow-800">{order.specialInstructions}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  Order Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-mono font-semibold text-gray-900">
                      R{order.subtotal.toLocaleString()}
                    </span>
                  </div>
                  {order.totalDiscount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-600">Total Discount</span>
                      <span className="font-mono font-semibold text-green-700">
                        -R{order.totalDiscount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="h-px bg-gray-200"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold font-mono text-purple-600">
                      R{order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Salesperson */}
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-600" />
                  Sales Representative
                </h3>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600">Handled By</span>
                  <span className="text-sm font-bold text-gray-900">
                    {order.salespersonName}
                  </span>
                </div>
              </div>

              {/* Signatures */}
              {order.signatures && (
                <div className="card">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-600" />
                    Signatures
                  </h3>
                  <div className="space-y-3">
                    {order.signatures.salesperson && (
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-sm font-semibold text-gray-900 mb-2">
                          Salesperson Signature
                        </p>
                        {order.signatures.salesperson.imageData ? (
                          <img
                            src={order.signatures.salesperson.imageData}
                            alt="Salesperson Signature"
                            className="w-full h-24 object-contain bg-white border border-gray-200 rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-24 bg-white border border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                            <span className="text-sm text-gray-400">Signature captured</span>
                          </div>
                        )}
                        <p className="text-xs text-gray-600 mt-2">
                          Signed: {formatDateTime(order.signatures.salesperson.timestamp)}
                        </p>
                      </div>
                    )}
                    {order.signatures.customer && (
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-sm font-semibold text-gray-900 mb-2">
                          Customer Signature
                        </p>
                        {order.signatures.customer.imageData ? (
                          <img
                            src={order.signatures.customer.imageData}
                            alt="Customer Signature"
                            className="w-full h-24 object-contain bg-white border border-gray-200 rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-24 bg-white border border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                            <span className="text-sm text-gray-400">Signature captured</span>
                          </div>
                        )}
                        <p className="text-xs text-gray-600 mt-2">
                          Signed: {formatDateTime(order.signatures.customer.timestamp)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'items' && (
            <>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="card">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-2xl">
                        🥩
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">
                          {item.productName}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">SKU: {item.sku}</p>
                        <div className="flex items-center gap-2">
                          {item.temperature && (
                            <span className="temp-chilled text-xxs">
                              <Thermometer className="h-3 w-3" />
                              {item.temperature}
                            </span>
                          )}
                          {item.grade && (
                            <span className="grade-a text-xxs">
                              <Award className="h-3 w-3" />
                              {item.grade}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Quantity</span>
                        <span className="font-mono font-semibold text-gray-900">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Unit Price</span>
                        <span className="font-mono font-semibold text-gray-900">
                          R{item.unitPrice.toLocaleString()}
                        </span>
                      </div>
                      {item.discountPercent > 0 && (
                        <div className="flex items-center justify-between text-sm text-green-600">
                          <span>Discount ({item.discountPercent}%)</span>
                          <span className="font-mono font-semibold">
                            -R{item.discountAmount.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="h-px bg-gray-200"></div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="text-lg font-bold font-mono text-purple-600">
                          R{item.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Items Summary */}
              <div className="card bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-purple-900">
                    Total Items
                  </span>
                  <span className="text-2xl font-bold text-purple-600">
                    {order.items.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-purple-900">
                    Total Units
                  </span>
                  <span className="text-2xl font-bold text-purple-600">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
              </div>
            </>
          )}

          {activeTab === 'tracking' && (
            <>
              {/* Status Timeline */}
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  Order Status Timeline
                </h3>
                <div className="space-y-4">
                  {/* Created */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <p className="font-semibold text-gray-900 mb-1">Order Created</p>
                      <p className="text-sm text-gray-600">
                        {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Submitted */}
                  {order.submittedAt && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                      </div>
                      <div className="flex-1 pb-6">
                        <p className="font-semibold text-gray-900 mb-1">Order Submitted</p>
                        <p className="text-sm text-gray-600">
                          {formatDateTime(order.submittedAt)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Confirmed */}
                  {order.confirmedAt && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                      </div>
                      <div className="flex-1 pb-6">
                        <p className="font-semibold text-gray-900 mb-1">Order Confirmed</p>
                        <p className="text-sm text-gray-600">
                          {formatDateTime(order.confirmedAt)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Delivered */}
                  {order.deliveredAt ? (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">Order Delivered</p>
                        <p className="text-sm text-gray-600">
                          {formatDateTime(order.deliveredAt)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">Awaiting Delivery</p>
                        <p className="text-sm text-gray-600">
                          Expected: {formatDate(order.deliveryDate)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Current Status Card */}
              <div className={`card border-2 ${getStatusBadgeClass()}`}>
                <div className="flex items-center gap-3 mb-3">
                  {getStatusIcon()}
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Status</p>
                    <p className="text-xl font-bold text-gray-900">{statusInfo?.label}</p>
                  </div>
                </div>
                {order.status === 'in_transit' && (
                  <p className="text-sm text-gray-600">
                    Your order is on the way and will be delivered on{' '}
                    <span className="font-semibold">{formatDate(order.deliveryDate)}</span>
                  </p>
                )}
                {order.status === 'processing' && (
                  <p className="text-sm text-gray-600">
                    Your order is being prepared for delivery
                  </p>
                )}
                {order.status === 'delivered' && (
                  <p className="text-sm text-gray-600">
                    Your order was successfully delivered on{' '}
                    <span className="font-semibold">
                      {order.deliveredAt && formatDate(order.deliveredAt)}
                    </span>
                  </p>
                )}
              </div>
            </>
          )}

          {/* Bottom Padding */}
          <div className="h-4"></div>
        </div>

        {/* Action Buttons */}
        {activeTab === 'details' && order.status !== 'cancelled' && order.status !== 'delivered' && (
          <div className="p-4 bg-white border-t border-gray-200 safe-bottom space-y-3">
            {order.status === 'draft' && (
              <button className="btn-primary w-full">
                <FileText className="h-5 w-5" />
                <span>Submit Order</span>
              </button>
            )}
            {['submitted', 'confirmed', 'processing'].includes(order.status) && (
              <button className="btn-secondary w-full">
                <Phone className="h-5 w-5" />
                <span>Contact Customer</span>
              </button>
            )}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
