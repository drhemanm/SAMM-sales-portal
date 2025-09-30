'use client';

import React from 'react';
import { Plus, Thermometer, Award, Package, AlertCircle } from 'lucide-react';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  showStock?: boolean;
  compact?: boolean;
}

export default function ProductCard({
  product,
  onAddToCart,
  showStock = true,
  compact = false,
}: ProductCardProps) {
  // Calculate stock level percentage
  const stockPercentage = product.lowStockThreshold
    ? Math.min((product.availableStock / product.lowStockThreshold) * 100, 100)
    : 100;

  // Determine stock status
  const getStockStatus = () => {
    if (product.availableStock === 0) {
      return { level: 'out', label: 'Out of Stock', color: 'text-red-600' };
    }
    if (product.availableStock <= product.lowStockThreshold * 0.5) {
      return { level: 'critical', label: 'Critical Stock', color: 'text-red-600' };
    }
    if (product.availableStock <= product.lowStockThreshold) {
      return { level: 'low', label: 'Low Stock', color: 'text-yellow-600' };
    }
    return { level: 'good', label: 'In Stock', color: 'text-green-600' };
  };

  const stockStatus = getStockStatus();

  // Stock bar color class
  const getStockBarClass = () => {
    if (stockStatus.level === 'out' || stockStatus.level === 'critical') {
      return 'stock-low';
    }
    if (stockStatus.level === 'low') {
      return 'stock-medium';
    }
    return 'stock-high';
  };

  // Temperature badge
  const getTempBadgeClass = () => {
    if (!product.temperature) return '';
    if (product.temperature.includes('-')) return 'temp-frozen';
    if (product.temperature.includes('0-4')) return 'temp-chilled';
    return 'temp-ambient';
  };

  // Grade badge
  const getGradeBadgeClass = () => {
    if (product.grade === 'Premium') return 'grade-premium';
    return 'grade-a';
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart && product.availableStock > 0) {
      onAddToCart(product);
    }
  };

  if (compact) {
    // Compact list view
    return (
      <div className="list-item-interactive">
        <div className="flex items-center gap-3 flex-1">
          {/* Icon/Image */}
          <div className="w-12 h-12 bg-gray-100 rounded-meat flex items-center justify-center text-2xl flex-shrink-0">
            {product.icon || '🥩'}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-neutral-brown line-clamp-1">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-mono font-bold text-meat-red">
                R{product.price}/{product.unit}
              </span>
              {showStock && (
                <span className={`text-xs ${stockStatus.color}`}>
                  {product.availableStock}{product.unit}
                </span>
              )}
            </div>
          </div>

          {/* Add Button */}
          {onAddToCart && (
            <button
              onClick={handleAddClick}
              disabled={product.availableStock === 0}
              className="btn-icon flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus className="h-5 w-5 text-meat-red" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Full card view
  return (
    <div className="card-interactive">
      {/* Header with Category */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-neutral-brown-light uppercase tracking-wide">
          {product.category}
        </span>
        {product.status === 'out_of_stock' && (
          <span className="badge-danger text-xxs">Out of Stock</span>
        )}
      </div>

      {/* Product Icon/Image */}
      <div className="w-full h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-meat mb-4 flex items-center justify-center text-6xl">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-meat"
          />
        ) : (
          <span>{product.icon || '🥩'}</span>
        )}
      </div>

      {/* Product Name */}
      <h3 className="font-bold text-lg text-neutral-brown mb-2 line-clamp-2">
        {product.name}
      </h3>

      {/* SKU */}
      <p className="text-xs text-neutral-brown-light mb-3 font-mono">
        SKU: {product.sku}
      </p>

      {/* Specifications */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Temperature */}
        {product.temperature && (
          <div className={getTempBadgeClass()}>
            <Thermometer className="h-3 w-3" />
            <span>{product.temperature}</span>
          </div>
        )}

        {/* Grade */}
        {product.grade && (
          <div className={getGradeBadgeClass()}>
            <Award className="h-3 w-3" />
            <span>{product.grade}</span>
          </div>
        )}
      </div>

      {/* Stock Information */}
      {showStock && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <Package className="h-4 w-4 text-neutral-brown-light" />
              <span className="text-sm text-neutral-brown-light">Stock</span>
            </div>
            <span className={`text-sm font-semibold ${stockStatus.color}`}>
              {product.availableStock} {product.unit}
            </span>
          </div>

          {/* Stock Bar */}
          <div className="stock-bar">
            <div
              className={`stock-fill ${getStockBarClass()}`}
              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
            />
          </div>

          {/* Stock Warning */}
          {(stockStatus.level === 'low' || stockStatus.level === 'critical') && (
            <div className="flex items-center gap-1 mt-2">
              <AlertCircle className="h-3 w-3 text-yellow-600" />
              <span className="text-xs text-yellow-700">
                {stockStatus.label} - Reorder soon
              </span>
            </div>
          )}
        </div>
      )}

      {/* Price and Add Button */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-neutral-brown-light mb-1">Price</p>
          <p className="text-2xl font-bold text-meat-red font-mono">
            R{product.price}
            <span className="text-sm text-neutral-brown-light font-normal ml-1">
              /{product.unit}
            </span>
          </p>
        </div>

        {onAddToCart && (
          <button
            onClick={handleAddClick}
            disabled={product.availableStock === 0}
            className={`btn-primary ${
              product.availableStock === 0
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            <Plus className="h-5 w-5" />
            <span>Add</span>
          </button>
        )}
      </div>

      {/* Out of Stock Overlay */}
      {product.availableStock === 0 && (
        <div className="absolute inset-0 bg-white/90 rounded-meat flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
            <p className="font-semibold text-red-700">Out of Stock</p>
            <p className="text-sm text-red-600 mt-1">Check back later</p>
          </div>
        </div>
      )}
    </div>
  );
}
