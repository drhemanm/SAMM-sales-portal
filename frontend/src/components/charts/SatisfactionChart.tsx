'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { SatisfactionData } from '@/lib/mockAnalytics';

interface SatisfactionChartProps {
  data: SatisfactionData[];
}

export default function SatisfactionChart({ data }: SatisfactionChartProps) {
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
          padding: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}>
          <p style={{ 
            color: '#374151', 
            fontWeight: 600, 
            marginBottom: '8px',
            fontSize: '14px'
          }}>
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '4px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: entry.color
              }} />
              <span style={{ 
                color: '#6B7280', 
                fontSize: '13px',
                fontWeight: 500
              }}>
                {entry.name}:
              </span>
              <span style={{ 
                color: '#374151', 
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: 'monospace'
              }}>
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculate averages
  const avgLastMonth = Math.round(
    data.reduce((sum, item) => sum + item.lastMonth, 0) / data.length
  );
  const avgThisMonth = Math.round(
    data.reduce((sum, item) => sum + item.thisMonth, 0) / data.length
  );
  const growthRate = (((avgThisMonth - avgLastMonth) / avgLastMonth) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">
            Customer Satisfaction
          </h3>
          <div className="flex items-center gap-1 px-3 py-1 bg-emerald-100 rounded-xl">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
            <span className="text-xs font-semibold text-emerald-600">
              +{growthRate}%
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Comparing performance month over month
        </p>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorLastMonth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorThisMonth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
            formatter={(value) => (
              <span style={{ color: '#6B7280', fontSize: '14px', fontWeight: 500 }}>
                {value}
              </span>
            )}
          />
          <Area
            type="monotone"
            dataKey="lastMonth"
            stroke="#F59E0B"
            strokeWidth={2}
            fill="url(#colorLastMonth)"
            name="Last Month"
          />
          <Area
            type="monotone"
            dataKey="thisMonth"
            stroke="#10B981"
            strokeWidth={3}
            fill="url(#colorThisMonth)"
            name="This Month"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-600 font-medium mb-1">
            Average Last Month
          </p>
          <p className="text-xl font-bold text-amber-500 font-mono">
            {avgLastMonth.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 font-medium mb-1">
            Average This Month
          </p>
          <p className="text-xl font-bold text-emerald-600 font-mono">
            {avgThisMonth.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 font-medium mb-1">
            Growth Rate
          </p>
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold text-emerald-600 font-mono">
              +{growthRate}%
            </p>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
