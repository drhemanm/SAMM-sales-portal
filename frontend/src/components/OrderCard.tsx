'use client';

import React from 'react';
import {
  Package,
  Calendar,
  DollarSign,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  ChevronRight,
  MapPin,
  User,
} from 'lucide-react';
import type { Order } from '@/types';
import { ORDER_STATUSES } from '@/types';

interface OrderCardProps {
  order: Order;
  onClick?: (order: Order) => void;
  showCustomer?: boolean;
  compact?: boolean;
}

export default function OrderCard({
  order,
  onClick,
  showCustomer = true,
  compact = false,
}: OrderCardProps) {
  // Get status info
  const getStatusInfo = () => {
    const statusInfo = ORDER_STATUSES.find((s) => s.value === order.status);
    return statusInfo || { value: order.status, label: 'Unknown', color: 'gray' };
  };

  const statusInfo = getStatusInfo();

  // Get status icon
  const getStatusIcon = () => {
    switch (order.status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_transit':
        return <Truck className="h-4 w-4 text-blue-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get status badge color
  const getStatusBadgeClass = () => {
    switch (statusInfo.color) {
      case 'green':
        return 'badge-success';
      case 'blue':
        return 'bg-blue-100 text-blue-800';
      case 'yellow':
        return 'badge-warning';
      case 'red':
        return 'badge-danger';
      case 'purple':
        return 'bg-purple-100 text-purple-800';
      case 'gray':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (d.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    
    return d.toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: d.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  };

  // Format time
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleClick = () => {
    if (onClick) {
      onClick(order);
    }
  };

  if (compact) {
    // Compact list view
    return (
      <div className="list-item-interactive" onClick={handleClick}>
        <div className="flex items-center gap-3 flex-1">
          {/* Status Icon */}
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            {getStatusIcon()}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-neutral-brown text-sm">
                {order.orderNumber}
              </h3>
              <span className={`badge text-xxs ${getStatusBadgeClass()}`}>
                {statusInfo.label}
              </span>
            </div>
            {showCustomer && (
              <p className="text-xs text-neutral-brown-light line-clamp-1">
                {order.customerName}
              </p>
            )}
            <div className="flex items-center gap-2 text-xs text-neutral-brown-light mt-1">
              <span>{order.items.length} items</span>
              <span>•</span>
              <span className="font-mono font-semibold text-meat-red">
                R{order.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Arrow */}
          <ChevronRight className="h-5 w-5 text-neutral-brown-light flex-shrink-0" />
        </div>
      </div>
    );
  }

  // Full card view
  return (
    <div className="card-interactive" onClick={handleClick}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg text-neutral-brown">
              {order.orderNumber}
            </h3>
            {order.syncStatus === 'pending' && (
              <span className="badge bg-yellow-100 text-yellow-800 text-xxs">
                Pending Sync
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-brown-light">
            {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
          </p>
        </div>

        {/* Status Badge */}
        <div className={`badge ${getStatusBadgeClass()}`}>
          {getStatusIcon()}
          <span>{statusInfo.label}</span>
        </div>
      </div>

      {/* Customer Info */}
      {showCustomer && (
        <div className="bg-gray-50 rounded-meat p-3 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-4 w-4 text-neutral-brown-light" />
            <span className="text-xs text-neutral-brown-light">Customer</span>
          </div>
          <p className="font-semibold text-neutral-brown">{order.customerName}</p>
          <p className="text-sm text-neutral-brown-light">{order.customerType}</p>
        </div>
      )}

      {/* Order Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Items */}
        <div className="bg-gray-50 rounded-meat p-3">
          <div className="flex items-center gap-1 mb-1">
            <Package className="h-3 w-3 text-neutral-brown-light" />
            <span className="text-xs text-neutral-brown-light">Items</span>
          </div>
          <p className="text-lg font-bold text-neutral-brown">
            {order.items.length}
          </p>
          <p className="text-xs text-neutral-brown-light mt-1">
            {order.items.reduce((sum, item) => sum + item.quantity, 0)} units
          </p>
        </div>

        {/* Total Amount */}
        <div className="bg-gradient-to-br from-meat-red to-meat-red-light rounded-meat p-3 text-white">
          <div className="flex items-center gap-1 mb-1">
            <DollarSign className="h-3 w-3" />
            <span className="text-xs opacity-90">Total</span>
          </div>
          <p className="text-lg font-bold font-mono">
            R{order.totalAmount.toLocaleString()}
          </p>
          {order.totalDiscount > 0 && (
            <p className="text-xs opacity-90 mt-1">
              Saved R{order.totalDiscount.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Delivery Info */}
      <div className="bg-blue-50 rounded-meat p-3 mb-4">
        <div className="flex items-start gap-2">
          <Calendar className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-900">
              Delivery: {formatDate(order.deliveryDate)}
            </p>
            {order.deliveryAddress && (
              <p className="text-xs text-blue-700 mt-1 line-clamp-1">
                {order.deliveryAddress}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Special Instructions */}
      {order.specialInstructions && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-meat p-3 mb-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-yellow-900 mb-1">
                Special Instructions:
              </p>
              <p className="text-xs text-yellow-800 line-clamp-2">
                {order.specialInstructions}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Item Preview */}
      <div className="pt-3 border-t border-gray-200">
        <p className="text-xs text-neutral-brown-light mb-2">Order Items:</p>
        <div className="space-y-1">
          {order.items.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-neutral-brown line-clamp-1 flex-1">
                {item.quantity}{item.unit} × {item.productName}
              </span>
              <span className="font-mono text-neutral-brown-light ml-2">
                R{item.total.toLocaleString()}
              </span>
            </div>
          ))}
          {order.items.length > 3 && (
            <p className="text-xs text-neutral-brown-light italic">
              +{order.items.length - 3} more items
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
        <div className="flex items-center gap-1 text-xs text-neutral-brown-light">
          <User className="h-3 w-3" />
          <span>{order.salespersonName}</span>
        </div>
        <ChevronRight className="h-5 w-5 text-neutral-brown-light" />
      </div>

      {/* Requires Attention Banner */}
      {order.status === 'in_transit' && (
        <div className="mt-4 bg-blue-100 border-l-4 border-blue-500 p-3 rounded">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-blue-600" />
            <p className="text-sm font-semibold text-blue-900">
              Order in transit - Track delivery
            </p>
          </div>
        </div>
      )}

      {order.status === 'cancelled' && (
        <div className="mt-4 bg-red-100 border-l-4 border-red-500 p-3 rounded">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-600" />
            <p className="text-sm font-semibold text-red-900">
              Order cancelled
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
