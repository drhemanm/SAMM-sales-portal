'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  Target,
  Users,
  ShoppingCart,
  DollarSign,
  Award,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Calendar,
  Sparkles,
  ChevronRight,
  Plus,
} from 'lucide-react';
import MobileLayout from '@/components/MobileLayout';
import { analyticsService } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock dashboard data (replace with real API data later)
  const mockDashboard = {
    today: {
      sales: 87450,
      orders: 23,
      customers: 8,
      avgOrderValue: 3800,
    },
    thisMonth: {
      sales: 2340000,
      orders: 645,
      customers: 187,
      growth: 12.5,
      target: 2500000,
    },
    recentActivity: [
      { id: 1, type: 'order', customer: 'The Grand Hotel', amount: 15200, time: '2h ago' },
      { id: 2, type: 'order', customer: 'Prime Steakhouse', amount: 8900, time: '4h ago' },
      { id: 3, type: 'customer', customer: 'New customer added', amount: 0, time: '5h ago' },
    ],
    topProducts: [
      { name: 'Prime Ribeye', sales: 45600, growth: 15 },
      { name: 'Wagyu Burgers', sales: 32400, growth: 8 },
      { name: 'Chicken Breast', sales: 28900, growth: -3 },
    ],
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, fetch real data:
      // const data = await analyticsService.getDashboard();
      
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboard(true);
  };

  const monthlyAchievement = (mockDashboard.thisMonth.sales / mockDashboard.thisMonth.target) * 100;

  if (loading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="spinner-lg mb-4 text-rose-600"></div>
            <p className="text-gray-600 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        {/* Modern Hero Header with Gradient */}
        <div className="bg-gradient-to-br from-rose-600 via-rose-500 to-pink-500 text-white">
          <div className="p-6 pb-8">
            {/* Greeting */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-white/80 text-sm mb-1">Welcome back,</p>
                <h1 className="text-3xl font-display font-bold">Dashboard</h1>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl hover:bg-white/30 transition-all duration-200 active:scale-95 shadow-lg disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-6 w-6 text-white ${refreshing ? 'animate-spin' : ''}`}
                />
              </button>
            </div>

            {/* Today's Performance */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
                <p className="text-white/80 text-sm mb-1">Today's Sales</p>
                <p className="text-3xl font-bold font-mono">R{(mockDashboard.today.sales / 1000).toFixed(0)}k</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-4 w-4 text-emerald-300" />
                  <span className="text-sm text-emerald-300 font-medium">+12%</span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
                <p className="text-white/80 text-sm mb-1">Today's Orders</p>
                <p className="text-3xl font-bold">{mockDashboard.today.orders}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-4 w-4 text-emerald-300" />
                  <span className="text-sm text-emerald-300 font-medium">+8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 bg-gray-50 space-y-4">
          {/* Monthly Target Card */}
          <div className="card bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/80 text-sm mb-1">Monthly Target</p>
                <p className="text-3xl font-bold font-mono">R{(mockDashboard.thisMonth.target / 1000).toFixed(0)}k</p>
              </div>
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/90">Current Sales</span>
                <span className="font-bold font-mono">R{(mockDashboard.thisMonth.sales / 1000).toFixed(0)}k</span>
              </div>
              <div className="progress-bar bg-white/20">
                <div
                  className="h-full bg-white rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(monthlyAchievement, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/90">Achievement</span>
                <span className="font-bold">{monthlyAchievement.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="card bg-white hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/orders')}>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-blue-500/25">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{mockDashboard.thisMonth.orders}</p>
              <p className="text-xs text-gray-600 font-medium">Orders</p>
            </div>

            <div className="card bg-white hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/customers')}>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/25">
                <Users className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{mockDashboard.thisMonth.customers}</p>
              <p className="text-xs text-gray-600 font-medium">Customers</p>
            </div>

            <div className="card bg-white hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/inventory')}>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-amber-500/25">
                <Package className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">324</p>
              <p className="text-xs text-gray-600 font-medium">Products</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-rose-600" />
                Quick Actions
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => router.push('/orders/new')}
                className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border-2 border-rose-200 hover:border-rose-300 hover:shadow-md transition-all active:scale-95"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-rose-600 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/25">
                  <Plus className="h-7 w-7 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-900">New Order</span>
              </button>

              <button
                onClick={() => router.push('/inventory')}
                className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 hover:border-blue-300 hover:shadow-md transition-all active:scale-95"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Package className="h-7 w-7 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-900">Browse Products</span>
              </button>

              <button
                onClick={() => router.push('/customers')}
                className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200 hover:border-emerald-300 hover:shadow-md transition-all active:scale-95"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-900">View Customers</span>
              </button>

              <button
                onClick={() => router.push('/analytics')}
                className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200 hover:border-purple-300 hover:shadow-md transition-all active:scale-95"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-900">Analytics</span>
              </button>
            </div>
          </div>

          {/* Top Products */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                Top Products
              </h3>
              <button
                onClick={() => router.push('/inventory')}
                className="text-sm font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                View All
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              {mockDashboard.topProducts.map((product, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                    index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-500' : 
                    index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' : 
                    'bg-gradient-to-br from-orange-400 to-orange-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600 font-mono">R{product.sales.toLocaleString()}</p>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    product.growth >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {product.growth >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {Math.abs(product.growth)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Recent Activity
              </h3>
            </div>
            <div className="space-y-3">
              {mockDashboard.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    activity.type === 'order' 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                      : 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                  }`}>
                    {activity.type === 'order' ? (
                      <ShoppingCart className="h-5 w-5 text-white" />
                    ) : (
                      <Users className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{activity.customer}</p>
                    {activity.amount > 0 && (
                      <p className="text-sm text-gray-600 font-mono">R{activity.amount.toLocaleString()}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Padding */}
          <div className="h-4"></div>
        </div>
      </div>
    </MobileLayout>
  );
}
