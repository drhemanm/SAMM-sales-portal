'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { VisitorData } from '@/lib/mockAnalytics';

interface VisitorInsightsChartProps {
  data: VisitorData[];
}

export default function VisitorInsightsChart({ data }: VisitorInsightsChartProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Visitor Insights</h3>
          <p className="text-sm text-gray-600 mt-1">Customer engagement trends</p>
        </div>
        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
          Export
        </button>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
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
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              padding: '12px',
            }}
            labelStyle={{ color: '#374151', fontWeight: 600, marginBottom: '8px' }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
            formatter={(value) => (
              <span style={{ color: '#6B7280', fontSize: '14px', fontWeight: 500 }}>
                {value}
              </span>
            )}
          />
          <Line
            type="monotone"
            dataKey="loyal"
            stroke="#8B5CF6"
            strokeWidth={3}
            dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
            name="Loyal Customers"
          />
          <Line
            type="monotone"
            dataKey="newCustomers"
            stroke="#EF4444"
            strokeWidth={3}
            dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
            name="New Customers"
          />
          <Line
            type="monotone"
            dataKey="unique"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
            name="Unique Customers"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
