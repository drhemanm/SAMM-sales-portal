'use client';

import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  TrendingUp,
  ChevronRight,
  Award,
} from 'lucide-react';
import type { Customer } from '@/types';
import { CUSTOMER_TYPES } from '@/types';

interface CustomerCardProps {
  customer: Customer;
  onClick?: (customer: Customer) => void;
  showDistance?: boolean;
  compact?: boolean;
}

export default function CustomerCard({
  customer,
  onClick,
  showDistance = true,
  compact = false,
}: CustomerCardProps) {
  const creditPercentage = (customer.creditUsed / customer.creditLimit) * 100;

  const getCreditStatusColor = () => {
    if (creditPercentage >= 90) return 'text-red-600';
    if (creditPercentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getCustomerIcon = () => {
    const typeInfo = CUSTOMER_TYPES.find((t) => t.value === customer.type);
    return typeInfo?.icon || '📦';
  };

  const getCustomerTypeLabel = () => {
    const typeInfo = CUSTOMER_TYPES.find((t) => t.value === customer.type);
    return typeInfo?.label || 'Other';
  };

  const formatLastOrder = () => {
    if (!customer.lastOrderDate) return 'No orders yet';
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

  const handleClick = () => {
    if (onClick) {
      onClick(customer);
    }
  };

  if (compact) {
    // Compact list view
    return (
      <div className="list-item-interactive" onClick={handleClick}>
        <div className="flex items-center gap-3 flex-1">
          {/* Icon */}
          <div className="w-12 h-12 bg-gradient-to-br from-meat-red to-meat-red-light rounded-full flex items-center justify-center text-2xl flex-shrink-0">
            {getCustomerIcon()}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-neutral-brown line-clamp-1">
              {customer.name}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-neutral-brown-light">
              <span>{getCustomerTypeLabel()}</span>
              {showDistance && customer.distance && (
                <>
                  <span>•</span>
                  <span>{customer.distance.toFixed(1)}km</span>
                </>
              )}
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
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="w-14 h-14 bg-gradient-to-br from-meat-red to-meat-red-light rounded-full flex items-center justify-center text-3xl">
            {getCustomerIcon()}
          </div>

          {/* Name & Type */}
          <div>
            <h3 className="font-bold text-lg text-neutral-brown line-clamp-1">
              {customer.name}
            </h3>
            <span className="text-sm text-neutral-brown-light">
              {getCustomerTypeLabel()}
            </span>
          </div>
        </div>

        {/* Premium Badge */}
        {customer.totalValue > 100000 && (
          <div className="badge-premium">
            <Award className="h-3 w-3" />
            <span>Premium</span>
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        {customer.phone && (
          <div className="flex items-center gap-2 text-sm text-neutral-brown-light">
            <Phone className="h-4 w-4" />
            <span>{customer.phone}</span>
          </div>
        )}
        {customer.email && (
          <div className="flex items-center gap-2 text-sm text-neutral-brown-light">
            <Mail className="h-4 w-4" />
            <span className="line-clamp-1">{customer.email}</span>
          </div>
        )}
        {showDistance && customer.distance !== undefined && (
          <div className="flex items-center gap-2 text-sm text-neutral-brown-light">
            <MapPin className="h-4 w-4" />
            <span>{customer.distance.toFixed(1)} km away</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Total Orders */}
        <div className="bg-gray-50 rounded-meat p-3">
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp className="h-3 w-3 text-neutral-brown-light" />
            <span className="text-xs text-neutral-brown-light">Orders</span>
          </div>
          <p className="text-lg font-bold text-neutral-brown">
            {customer.totalOrders}
          </p>
        </div>

        {/* Total Value */}
        <div className="bg-gray-50 rounded-meat p-3">
          <div className="flex items-center gap-1 mb-1">
            <DollarSign className="h-3 w-3 text-neutral-brown-light" />
            <span className="text-xs text-neutral-brown-light">Total Value</span>
          </div>
          <p className="text-lg font-bold text-meat-red">
            R{(customer.totalValue / 1000).toFixed(0)}k
          </p>
        </div>
      </div>

      {/* Credit Status */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-neutral-brown-light">Credit Used</span>
          <span className={`text-sm font-semibold ${getCreditStatusColor()}`}>
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
      </div>

      {/* Last Order */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-neutral-brown-light">
          <Calendar className="h-4 w-4" />
          <span>Last order: {formatLastOrder()}</span>
        </div>
        <ChevronRight className="h-5 w-5 text-neutral-brown-light" />
      </div>
    </div>
  );
}
