'use client';

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  iconBgColor: string; // e.g., 'bg-red-100'
  iconColor: string; // e.g., 'text-red-600'
  title: string;
  value: string | number;
  change?: number; // percentage change
  trend?: 'up' | 'down';
  changeLabel?: string; // e.g., 'from yesterday'
}

export default function StatCard({
  icon: Icon,
  iconBgColor,
  iconColor,
  title,
  value,
  change,
  trend,
  changeLabel = 'from yesterday',
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-300">
      {/* Icon */}
      <div className={`w-12 h-12 ${iconBgColor} rounded-xl flex items-center justify-center mb-4`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>

      {/* Value */}
      <div className="mb-2">
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      </div>

      {/* Title */}
      <p className="text-sm text-gray-600 font-medium mb-3">{title}</p>

      {/* Change Indicator */}
      {change !== undefined && trend && (
        <div className="flex items-center gap-1">
          {trend === 'up' ? (
            <div className="flex items-center gap-1 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-semibold">+{change}%</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-600">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm font-semibold">-{change}%</span>
            </div>
          )}
          <span className="text-xs text-gray-500 ml-1">{changeLabel}</span>
        </div>
      )}
    </div>
  );
}
