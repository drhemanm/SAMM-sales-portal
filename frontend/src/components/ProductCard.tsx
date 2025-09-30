'use client';

import React from 'react';
import { ShoppingCart, Star, Thermometer, Award, TrendingUp, AlertCircle } from 'lucide-react';
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
  const stockPercentage = product.lowStockThreshold
    ? Math.min((product.availableStock / product.lowStockThreshold) * 100, 100)
    : 100;

  const getStockStatus = () => {
    if (product.availableStock === 0) {
      return { level: 'out', label: 'Out of Stock', color: 'text-red-600', bgColor: 'bg-red-50' };
    }
    if (product.availableStock <= product.lowStockThreshold * 0.5) {
      return { level: 'critical', label: 'Low Stock', color: 'text-red-600', bgColor: 'bg-red-50' };
    }
    if (product.availableStock <= product.lowStockThreshold) {
      return { level: 'low', label: 'Limited Stock', color: 'text-amber-600', bgColor: 'bg-amber-50' };
    }
    return { level: 'good', label: 'In Stock', color: 'text-emerald-600', bgColor: 'bg-emerald-50' };
  };

  const stockStatus = getStockStatus();

  const getStockBarClass = () => {
    if (stockStatus.level === 'out' || stockStatus.level === 'critical') return 'stock-low';
    if (stockStatus.level === 'low') return 'stock-medium';
    return 'stock-high';
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart && product.availableStock > 0) {
      onAddToCart(product);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-rose-200 hover:shadow-lg transition-all duration-200 group">
        {/* Product Image */}
        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden group-hover:scale-105 transition-transform duration-200">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{product.icon || '🥩'}</span>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 line-clamp-1 text-sm">
              {product.name}
            </h3>
            {product.grade === 'Premium' && (
              <span className="badge-premium text-xxs shrink-0">
                <Star className="h-3 w-3 fill-white" />
                Premium
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-gray-900">
              R{product.price}
            </span>
            <span className="text-xs text-gray-500">/{product.unit}</span>
          </div>

          {showStock && (
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <div className="stock-bar h-1.5">
                  <div
                    className={`stock-fill ${getStockBarClass()}`}
                    style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                  />
                </div>
              </div>
              <span className={`text-xs font-medium ${stockStatus.color}`}>
                {product.availableStock} {product.unit}
              </span>
            </div>
          )}
        </div>

        {/* Add Button */}
        {onAddToCart && (
          <button
            onClick={handleAddClick}
            disabled={product.availableStock === 0}
            className="btn-icon flex-shrink-0 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        )}
      </div>
    );
  }

  // Full card view
  return (
    <div className="card-product relative group">
      {/* Premium Badge */}
      {product.grade === 'Premium' && (
        <div className="absolute top-4 left-4 z-10">
          <span className="badge-premium shadow-lg">
            <Star className="h-3 w-3 fill-white" />
            Premium
          </span>
        </div>
      )}

      {/* Stock Badge */}
      {showStock && stockStatus.level !== 'good' && (
        <div className="absolute top-4 right-4 z-10">
          <span className={`badge ${stockStatus.bgColor} ${stockStatus.color} shadow-lg`}>
            {stockStatus.level === 'out' && <AlertCircle className="h-3 w-3" />}
            {stockStatus.label}
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="relative w-full h-56 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-7xl">
            {product.icon || '🥩'}
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Product Details */}
      <div className="space-y-3">
        {/* Category */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {product.category}
          </span>
          <span className="text-xs text-gray-400 font-mono">
            {product.sku}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>

        {/* Specifications */}
        <div className="flex flex-wrap gap-2">
          {product.temperature && (
            <div className="temp-chilled">
              <Thermometer className="h-3 w-3" />
              <span>{product.temperature}</span>
            </div>
          )}
          {product.grade && product.grade !== 'Premium' && (
            <div className="grade-a">
              <Award className="h-3 w-3" />
              <span>{product.grade}</span>
            </div>
          )}
        </div>

        {/* Stock Bar */}
        {showStock && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Availability</span>
              <span className={`font-semibold ${stockStatus.color}`}>
                {product.availableStock} {product.unit}
              </span>
            </div>
            <div className="stock-bar">
              <div
                className={`stock-fill ${getStockBarClass()}`}
                style={{ width: `${Math.min(stockPercentage, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-gray-900">
                R{product.price}
              </span>
              <span className="text-sm text-gray-500">
                /{product.unit}
              </span>
            </div>
            {product.status === 'active' && (
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-emerald-600" />
                <span className="text-xs text-emerald-600 font-medium">
                  Available
                </span>
              </div>
            )}
          </div>

          {onAddToCart && (
            <button
              onClick={handleAddClick}
              disabled={product.availableStock === 0}
              className={`group/btn flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-200 ${
                product.availableStock === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-rose-600 to-rose-500 text-white hover:from-rose-700 hover:to-rose-600 shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/40 active:scale-95'
              }`}
            >
              <ShoppingCart className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>

      {/* Out of Stock Overlay */}
      {product.availableStock === 0 && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-fade-in">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-3" />
            <p className="text-xl font-bold text-red-700 mb-1">Out of Stock</p>
            <p className="text-sm text-red-600">Check back soon</p>
          </div>
        </div>
      )}
    </div>
  );
}
