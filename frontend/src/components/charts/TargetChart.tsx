'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TargetData } from '@/lib/mockAnalytics';

interface TargetChartProps {
  data: TargetData[];
}

export default function TargetChart({ data }: TargetChartProps) {
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const reality = payload.find((p: any) => p.dataKey === 'reality')?.value || 0;
      const target = payload.find((p: any) => p.dataKey === 'target')?.value || 0;
      const achievement = ((reality / target) * 100).toFixed(1);
      const isAboveTarget = reality >= target;

      return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg min-w-[200px]">
          <p className="text-gray-900 font-bold mb-3 text-sm">
            {label}
          </p>
          
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-600 text-xs font-medium">
                  {entry.name}
                </span>
              </div>
              <span className="text-gray-900 text-sm font-bold font-mono">
                R{(entry.value / 1000).toFixed(0)}k
              </span>
            </div>
          ))}
          
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-600">
                Achievement
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-base font-bold font-mono ${
                  isAboveTarget ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {achievement}%
                </span>
                {isAboveTarget ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Calculate overall achievement
  const totalReality = data.reduce((sum, item) => sum + item.reality, 0);
  const totalTarget = data.reduce((sum, item) => sum + item.target, 0);
  const overallAchievement = ((totalReality / totalTarget) * 100).toFixed(1);
  const monthsAboveTarget = data.filter(item => item.reality >= item.target).length;
  const isOverallSuccess = parseFloat(overallAchievement) >= 100;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">
            Target vs Reality
          </h3>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${
            isOverallSuccess ? 'bg-emerald-100' : 'bg-amber-100'
          }`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" 
              stroke={isOverallSuccess ? '#059669' : '#F59E0B'} 
              strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span className={`text-xs font-bold ${
              isOverallSuccess ? 'text-emerald-600' : 'text-amber-600'
            }`}>
              {overallAchievement}%
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Monthly sales performance vs targets
        </p>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={340}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          barGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="square"
            iconSize={12}
            formatter={(value) => (
              <span style={{ 
                color: '#6B7280', 
                fontSize: '14px', 
                fontWeight: 500,
                marginLeft: '4px'
              }}>
                {value}
              </span>
            )}
          />
          <Bar
            dataKey="target"
            fill="#E5E7EB"
            radius={[6, 6, 0, 0]}
            name="Target"
            maxBarSize={50}
          />
          <Bar
            dataKey="reality"
            radius={[6, 6, 0, 0]}
            name="Reality"
            maxBarSize={50}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.reality >= entry.target ? '#10B981' : '#EF4444'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-600 font-medium mb-1.5">
            Total Target
          </p>
          <p className="text-xl font-bold text-gray-600 font-mono">
            R{(totalTarget / 1000).toFixed(0)}k
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 font-medium mb-1.5">
            Total Achieved
          </p>
          <p className="text-xl font-bold text-emerald-600 font-mono">
            R{(totalReality / 1000).toFixed(0)}k
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 font-medium mb-1.5">
            Success Rate
          </p>
          <p className="text-xl font-bold text-purple-600 font-mono">
            {monthsAboveTarget}/{data.length}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 font-medium mb-1.5">
            Overall Achievement
          </p>
          <div className="flex items-center gap-2">
            <p className={`text-xl font-bold font-mono ${
              isOverallSuccess ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {overallAchievement}%
            </p>
            {isOverallSuccess ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
