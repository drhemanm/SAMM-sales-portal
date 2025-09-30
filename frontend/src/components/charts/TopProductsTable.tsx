'use client';

import React from 'react';
import { TopProduct } from '@/lib/mockAnalytics';

interface TopProductsTableProps {
  data: TopProduct[];
}

export default function TopProductsTable({ data }: TopProductsTableProps) {
  // Get rank medal/badge
  const getRankBadge = (rank: number) => {
    const badges: Record<number, { emoji: string; color: string; bg: string; label: string }> = {
      1: { emoji: '🥇', color: '#F59E0B', bg: '#FEF3C7', label: 'Gold' },
      2: { emoji: '🥈', color: '#6B7280', bg: '#F3F4F6', label: 'Silver' },
      3: { emoji: '🥉', color: '#D97706', bg: '#FEF3C7', label: 'Bronze' },
    };
    
    return badges[rank] || { emoji: `${rank}`, color: '#6B7280', bg: '#F9FAFB', label: `#${rank}` };
  };

  // Get popularity color
  const getPopularityColor = (popularity: number): string => {
    if (popularity >= 80) return '#10B981'; // Green
    if (popularity >= 60) return '#3B82F6'; // Blue
    if (popularity >= 40) return '#F59E0B'; // Amber
    return '#EF4444'; // Red
  };

  // Calculate total sales
  const totalSales = data.reduce((sum, product) => sum + product.sales, 0);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-gray-900">
              Top Selling Products
            </h3>
            <div className="px-2.5 py-1 bg-indigo-50 rounded-lg text-xs font-semibold text-indigo-600">
              This Month
            </div>
          </div>
          <button className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Based on revenue and order volume
        </p>
      </div>

      {/* Table */}
      <div className="border border-gray-100 rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[80px_1fr_140px_120px_100px] gap-4 px-5 py-3.5 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider">
          <div>Rank</div>
          <div>Product Name</div>
          <div>Popularity</div>
          <div>Sales Share</div>
          <div className="text-right">Revenue %</div>
        </div>

        {/* Table Body */}
        {data.map((product, index) => {
          const badge = getRankBadge(product.rank);
          const popularityColor = getPopularityColor(product.popularity);
          
          return (
            <div
              key={product.rank}
              className={`grid grid-cols-[80px_1fr_140px_120px_100px] gap-4 px-5 py-4 items-center transition-all cursor-pointer hover:bg-blue-50 hover:translate-x-0.5 ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
              } ${index < data.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              {/* Rank Badge */}
              <div className="flex items-center gap-2">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                  style={{ backgroundColor: badge.bg, color: badge.color }}
                >
                  {badge.emoji}
                </div>
              </div>

              {/* Product Name */}
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-1">
                  {product.name}
                </div>
                <div className="text-xs text-gray-600">
                  Premium Quality
                </div>
              </div>

              {/* Popularity Bar */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-gray-900 font-mono">
                    {product.popularity}%
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${product.popularity}%`,
                      backgroundColor: popularityColor
                    }}
                  />
                </div>
              </div>

              {/* Sales Share Visual */}
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
                      style={{ width: `${(product.sales / totalSales) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-purple-600 font-mono">
                    {product.sales}
                  </span>
                </div>
              </div>

              {/* Revenue Percentage */}
              <div className="text-right">
                <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg ${
                  product.rank === 1 ? 'bg-amber-100' : 'bg-gray-100'
                }`}>
                  <span className={`text-sm font-bold font-mono ${
                    product.rank === 1 ? 'text-amber-700' : 'text-gray-700'
                  }`}>
                    {product.sales}%
                  </span>
                  {product.rank === 1 && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.5">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                      <polyline points="17 6 23 6 23 12"></polyline>
                    </svg>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="mt-5 p-4 bg-gray-50 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs text-gray-600 font-medium mb-1">
              Total Products Tracked
            </p>
            <p className="text-xl font-bold text-gray-900 font-mono">
              {data.length}
            </p>
          </div>
          <div className="w-px h-10 bg-gray-300" />
          <div>
            <p className="text-xs text-gray-600 font-medium mb-1">
              Combined Share
            </p>
            <p className="text-xl font-bold text-emerald-600 font-mono">
              {totalSales}%
            </p>
          </div>
        </div>
        <button className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2">
          View All Products
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}
