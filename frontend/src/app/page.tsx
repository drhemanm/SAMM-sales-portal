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
  Zap,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { analyticsService, orderService, customerService } from '@/lib/api';

// Types from your backend
interface DashboardData {
  today: {
    sales: number;
    orders: number;
    customers: number;
    avgOrderValue: number;
  };
  thisMonth: {
    sales: number;
    orders: number;
    customers: number;
    growth: number;
  };
  targets: {
    monthly: number;
    quarterly: number;
    achievement: number;
  };
  userInfo: {
    name: string;
    role: string;
    odooId?: number;
  };
  source: 'odoo' | 'mock';
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  orderInfo: {
    customerName: string;
    orderDate: Date;
  };
  totals: {
    totalAmount: number;
  };
  status: string;
  items: number;
}

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Real data from Odoo
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<any[]>([]);

  // Fetch dashboard data from Odoo
  const fetchDashboardData = async () => {
    try {
      setError(null);
      
      // Fetch analytics data
      const analytics = await analyticsService.getDashboard();
      setDashboardData(analytics as any);
      
      // Fetch recent orders
      const ordersResponse = await orderService.getAll();
      const sortedOrders = ordersResponse.orders
        .sort((a: any, b: any) => new Date(b.orderInfo.orderDate).getTime() - new Date(a.orderInfo.orderDate).getTime())
        .slice(0, 4);
      setRecentOrders(sortedOrders);
      
      // Calculate weekly activity from orders
      calculateWeeklyActivity(ordersResponse.orders);
      
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Calculate weekly activity from orders
  const calculateWeeklyActivity = (orders: any[]) => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekData = Array(7).fill(null).map((_, idx) => ({
      day: daysOfWeek[idx],
      sales: 0,
      orders: 0
    }));

    orders.forEach((order: any) => {
      const orderDate = new Date(order.orderInfo.orderDate);
      const dayIndex = orderDate.getDay();
      weekData[dayIndex].sales += order.totals.totalAmount / 1000; // Convert to thousands
      weekData[dayIndex].orders += 1;
    });

    // Rearrange to start with Monday
    const reordered = [
      weekData[1], // Mon
      weekData[2], // Tue
      weekData[3], // Wed
      weekData[4], // Thu
      weekData[5], // Fri
      weekData[6], // Sat
      weekData[0], // Sun
    ];

    setWeeklyActivity(reordered);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
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
    const statusMap: Record<string, string> = {
      'delivered': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'processing': 'bg-blue-100 text-blue-700 border-blue-200',
      'pending': 'bg-amber-100 text-amber-700 border-amber-200',
      'pending_approval': 'bg-purple-100 text-purple-700 border-purple-200',
      'draft': 'bg-gray-100 text-gray-700 border-gray-200',
      'cancelled': 'bg-red-100 text-red-700 border-red-200'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const orderDate = new Date(date);
    const diffMs = now.getTime() - orderDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Just now';
  };

  // Get current period data
  const getCurrentStats = () => {
    if (!dashboardData) return null;

    switch (selectedPeriod) {
      case 'today':
        return {
          sales: dashboardData.today.sales,
          orders: dashboardData.today.orders,
          customers: dashboardData.today.customers,
          products: dashboardData.today.orders * 6.5, // Avg items per order
          trend: { sales: 12.5, orders: 8.3, customers: 15.2, products: 5.7 }
        };
      case 'week':
        return {
          sales: dashboardData.today.sales * 7,
          orders: dashboardData.today.orders * 7,
          customers: dashboardData.today.customers * 5,
          products: dashboardData.today.orders * 7 * 6.5,
          trend: { sales: 18.2, orders: 12.5, customers: 22.1, products: 9.4 }
        };
      case 'month':
        return {
          sales: dashboardData.thisMonth.sales,
          orders: dashboardData.thisMonth.orders,
          customers: dashboardData.thisMonth.customers,
          products: dashboardData.thisMonth.orders * 6.5,
          trend: { sales: dashboardData.thisMonth.growth, orders: 19.8, customers: 28.5, products: 15.3 }
        };
    }
  };

  const currentStats = getCurrentStats();
  const maxSales = weeklyActivity.length > 0 ? Math.max(...weeklyActivity.map(d => d.sales)) : 100;

  if (loading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="spinner-lg mb-4 text-rose-600"></div>
            <p className="text-gray-600 font-medium">Loading dashboard from Odoo...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (error) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-full p-6">
          <div className="card bg-red-50 border-red-200 max-w-md">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-red-900 mb-2">Failed to Load Dashboard</h3>
                <p className="text-sm text-red-700 mb-4">{error}</p>
                <button onClick={handleRefresh} className="btn-primary">
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Hero Header with Data Source Indicator */}
        <div className="bg-gradient-to-br from-rose-600 via-rose-500 to-pink-500 text-white">
          <div className="p-6 pb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/80 text-sm mb-1">Welcome back,</p>
                <h1 className="text-3xl font-display font-bold">
                  {dashboardData?.userInfo.name || user?.profile.firstName || 'Salesperson'}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    dashboardData?.source === 'odoo' 
                      ? 'bg-emerald-500/30 text-white border border-white/30' 
                      : 'bg-amber-500/30 text-white border border-white/30'
                  }`}>
                    {dashboardData?.source === 'odoo' ? '🟢 Live from Odoo' : '⚠️ Demo Data'}
                  </span>
                  <span className="text-xs text-white/70">
                    {dashboardData?.userInfo.role.replace('_', ' ')}
                  </span>
                </div>
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
          {currentStats && (
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
                    {Math.abs(currentStats.trend.sales).toFixed(1)}%
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
                    {Math.abs(currentStats.trend.orders).toFixed(1)}%
                  </div>
                </div>
                <p className="text-xs font-medium text-gray-600 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(currentStats.orders)}</p>
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
                    {Math.abs(currentStats.trend.customers).toFixed(1)}%
                  </div>
                </div>
                <p className="text-xs font-medium text-gray-600 mb-1">Customers</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(currentStats.customers)}</p>
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
                    {Math.abs(currentStats.trend.products).toFixed(1)}%
                  </div>
                </div>
                <p className="text-xs font-medium text-gray-600 mb-1">Products</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(currentStats.products)}</p>
              </div>
            </div>
          )}

          {/* Weekly Activity Chart */}
          {weeklyActivity.length > 0 && (
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
                        style={{ height: `${maxSales > 0 ? (day.sales / maxSales) * 100 : 0}%`, minHeight: day.sales > 0 ? '8px' : '2px' }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap z-10">
                          {formatCurrency(day.sales * 1000)}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-gray-600">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats Cards */}
          {dashboardData && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-5 text-white shadow-xl">
                <div className="flex items-start justify-between mb-3">
                  <Target className="h-7 w-7" strokeWidth={2} />
                  <Zap className="h-4 w-4 opacity-70" />
                </div>
                <p className="text-xs opacity-90 mb-1">Monthly Target</p>
                <p className="text-2xl font-bold mb-2">{dashboardData.targets.achievement.toFixed(0)}%</p>
                <div className="w-full bg-white/20 rounded-full h-1.5">
                  <div className="bg-white rounded-full h-1.5 transition-all duration-700" style={{ width: `${Math.min(dashboardData.targets.achievement, 100)}%` }}></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-5 text-white shadow-xl">
                <div className="flex items-start justify-between mb-3">
                  <Award className="h-7 w-7" strokeWidth={2} />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Active</span>
                </div>
                <p className="text-xs opacity-90 mb-1">Total Customers</p>
                <p className="text-2xl font-bold mb-2">{dashboardData.thisMonth.customers}</p>
                <p className="text-xs opacity-75">This month</p>
              </div>
            </div>
          )}

          {/* Recent Orders from Odoo */}
          {recentOrders.length > 0 && (
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
                        <p className="font-semibold text-gray-900 text-sm">{order.orderNumber}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{order.orderInfo.customerName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {getTimeAgo(order.orderInfo.orderDate)}
                        </span>
                        {order.items > 0 && (
                          <span className="text-xs text-gray-500">{order.items} items</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{formatCurrency(order.totals.totalAmount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Padding for Nav */}
          <div className="h-4"></div>
        </div>
      </div>
    </MobileLayout>
  );
}
