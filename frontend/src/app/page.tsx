'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MobileLayout from '@/components/MobileLayout';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  ChevronRight,
  Target,
  Award,
  BarChart3,
  Clock,
  RefreshCw,
  Zap
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { analyticsService } from '@/lib/api';

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - Replace with real API calls later
  const stats = {
    today: {
      sales: 87500,
      orders: 24,
      customers: 18,
      products: 156,
      trend: {
        sales: 12.5,
        orders: 8.3,
        customers: 15.2,
        products: 5.7
      }
    },
    week: {
      sales: 512000,
      orders: 147,
      customers: 89,
      products: 847,
      trend: {
        sales: 18.2,
        orders: 12.5,
        customers: 22.1,
        products: 9.4
      }
    },
    month: {
      sales: 2150000,
      orders: 628,
      customers: 312,
      products: 3542,
      trend: {
        sales: 24.7,
        orders: 19.8,
        customers: 28.5,
        products: 15.3
      }
    }
  };

  const currentStats = stats[selectedPeriod];

  const recentOrders = [
    { id: 'ORD-2847', customer: 'Protea Hotel Waterfront', amount: 8500, status: 'delivered', time: '2h ago', items: 12 },
    { id: 'ORD-2846', customer: 'Ocean Basket Stellenbosch', amount: 6200, status: 'processing', time: '3h ago', items: 8 },
    { id: 'ORD-2845', customer: 'The Butcher Shop', amount: 12800, status: 'pending', time: '5h ago', items: 18 },
    { id: 'ORD-2844', customer: 'Spur Steak Ranch', amount: 9500, status: 'delivered', time: '6h ago', items: 14 }
  ];

  const topProducts = [
    { name: 'Premium Ribeye Steak', sold: 145, revenue: 87000, trend: 15.2, unit: 'kg' },
    { name: 'Grass-Fed Beef Mince', sold: 298, revenue: 52400, trend: 22.5, unit: 'kg' },
    { name: 'Lamb Chops', sold: 87, revenue: 45600, trend: -5.3, unit: 'kg' },
    { name: 'Free-Range Chicken', sold: 234, revenue: 38900, trend: 12.8, unit: 'kg' }
  ];

  const weeklyActivity = [
    { day: 'Mon', sales: 72, orders: 18 },
    { day: 'Tue', sales: 85, orders: 22 },
    { day: 'Wed', sales: 68, orders: 16 },
    { day: 'Thu', sales: 92, orders: 25 },
    { day: 'Fri', sales: 88, orders: 21 },
    { day: 'Sat', sales: 45, orders: 12 },
    { day: 'Sun', sales: 35, orders: 8 }
  ];

  const maxSales = Math.max(...weeklyActivity.map(d => d.sales));

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call - Replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

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
      <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Modern Hero Header */}
        <div className="bg-gradient-to-br from-rose-600 via-rose-500 to-pink-500 text-white">
          <div className="p-6 pb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-white/80 text-sm mb-1">Welcome back,</p>
                <h1 className="text-3xl font-display font-bold">
                  {user?.profile.firstName || 'Salesperson'}
                </h1>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl hover:bg-white/30 transition-all duration-200 active:scale-95 shadow-lg disabled:opacity-50"
              >
                <RefreshCw className={`h-6 w-6 text-white ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Period Selector */}
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-xl rounded-2xl p-1 border border-white/30">
              {(['today', 'week', 'month'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    selectedPeriod === period
                      ? 'bg-white text-rose-600 shadow-lg'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Total Sales */}
            <div className="card hover:shadow-xl transition-all active:scale-95 cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <DollarSign className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                  currentStats.trend.sales > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  {currentStats.trend.sales > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(currentStats.trend.sales)}%
                </div>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentStats.sales)}</p>
            </div>

            {/* Total Orders */}
            <div className="card hover:shadow-xl transition-all active:scale-95 cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ShoppingBag className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                  currentStats.trend.orders > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  {currentStats.trend.orders > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(currentStats.trend.orders)}%
                </div>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{currentStats.orders}</p>
            </div>

            {/* Active Customers */}
            <div className="card hover:shadow-xl transition-all active:scale-95 cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                  currentStats.trend.customers > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  {currentStats.trend.customers > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(currentStats.trend.customers)}%
                </div>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">Customers</p>
              <p className="text-2xl font-bold text-gray-900">{currentStats.customers}</p>
            </div>

            {/* Products Sold */}
            <div className="card hover:shadow-xl transition-all active:scale-95 cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Package className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                  currentStats.trend.products > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  {currentStats.trend.products > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(currentStats.trend.products)}%
                </div>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">Products</p>
              <p className="text-2xl font-bold text-gray-900">{currentStats.products}</p>
            </div>
          </div>

          {/* Weekly Activity Chart */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Weekly Activity</h3>
                <p className="text-xs text-gray-600">Sales performance</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
            </div>
            
            <div className="flex items-end justify-between gap-2 h-32">
              {weeklyActivity.map((day, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full relative group">
                    <div 
                      className="w-full bg-gradient-to-t from-rose-500 to-pink-500 rounded-t-lg transition-all duration-500 hover:from-rose-600 hover:to-pink-600"
                      style={{ height: `${(day.sales / maxSales) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-600">{day.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-5 text-white shadow-xl">
              <div className="flex items-start justify-between mb-3">
                <Target className="h-7 w-7" strokeWidth={2} />
                <Zap className="h-4 w-4 opacity-70" />
              </div>
              <p className="text-xs opacity-90 mb-1">Monthly Target</p>
              <p className="text-2xl font-bold mb-2">87%</p>
              <div className="w-full bg-white/20 rounded-full h-1.5">
                <div className="bg-white rounded-full h-1.5" style={{ width: '87%' }}></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-5 text-white shadow-xl">
              <div className="flex items-start justify-between mb-3">
                <Award className="h-7 w-7" strokeWidth={2} />
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Top 3</span>
              </div>
              <p className="text-xs opacity-90 mb-1">Sales Rank</p>
              <p className="text-2xl font-bold mb-2">#2</p>
              <p className="text-xs opacity-75">of 12 salespeople</p>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
              <button 
                onClick={() => router.push('/orders')}
                className="text-sm font-semibold text-blue-600 flex items-center gap-1"
              >
                View All <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              {recentOrders.map((order, idx) => (
                <div 
                  key={idx}
                  onClick={() => router.push(`/orders/${order.id}`)}
                  className="flex items-center justify-between p-3 bg-gray-50/80 hover:bg-gray-100/80 rounded-xl transition-all cursor-pointer active:scale-95 border border-gray-100"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900 text-sm">{order.id}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{order.customer}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {order.time}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(order.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Top Products</h3>
              <button 
                onClick={() => router.push('/inventory')}
                className="text-sm font-semibold text-blue-600 flex items-center gap-1"
              >
                View All <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              {topProducts.map((product, idx) => (
                <div key={idx}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-6 h-6 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                          {idx + 1}
                        </span>
                        <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                      </div>
                      <p className="text-xs text-gray-600">{product.sold} {product.unit} sold</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{formatCurrency(product.revenue)}</p>
                      <div className={`flex items-center gap-1 text-xs font-semibold ${
                        product.trend > 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {product.trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {Math.abs(product.trend)}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-full h-1.5 transition-all duration-500"
                      style={{ width: `${(product.revenue / 87000) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Padding for Nav */}
          <div className="h-4"></div>
        </div>
      </div>
    </MobileLayout>
  );
}
