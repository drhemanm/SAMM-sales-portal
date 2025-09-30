'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Target,
  AlertCircle,
  Package,
  Plus,
  RefreshCw,
  Calendar,
  DollarSign,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from 'lucide-react';
import MobileLayout from '@/components/MobileLayout';
import OrderCard from '@/components/OrderCard';
import { useAuthStore } from '@/store/authStore';
import { useOrders } from '@/hooks/useOrders';
import { analyticsService } from '@/lib/api';
import type { DashboardMetrics, Alert } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { todayOrders, pendingOrders, loading: ordersLoading } = useOrders();
  
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch dashboard data
  const fetchDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await analyticsService.getDashboard();
      setMetrics(data);

      // Mock alerts for now (will come from API later)
      setAlerts([
        {
          id: '1',
          type: 'stock',
          priority: 'high',
          message: 'Wagyu Burgers low stock (12kg remaining)',
          timestamp: new Date(),
          read: false,
          actionLabel: 'View Product',
        },
        {
          id: '2',
          type: 'order',
          priority: 'medium',
          message: '3 orders pending delivery today',
          timestamp: new Date(),
          read: false,
          actionLabel: 'View Orders',
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleRefresh = () => {
    fetchDashboard(true);
  };

  // Calculate today's achievement percentage
  const todayAchievement = metrics
    ? (metrics.today.sales / metrics.today.target) * 100
    : 0;

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Get alert icon
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'stock':
        return <Package className="h-4 w-4" />;
      case 'order':
        return <ShoppingCart className="h-4 w-4" />;
      case 'delivery':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Get alert color
  const getAlertColor = (priority: string) => {
    switch (priority) {
      case 'high':
      case 'urgent':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-900';
    }
  };

  if (loading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="spinner-lg mb-4"></div>
            <p className="text-neutral-brown-light">Loading dashboard...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="space-y-4 p-4">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-meat-red to-meat-red-light rounded-meat p-6 text-white shadow-meat">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm mb-1">{getGreeting()}</p>
              <h2 className="text-2xl font-bold">
                {user?.profile.firstName || 'Salesperson'}
              </h2>
              <p className="text-white/80 text-sm mt-1">
                {user?.profile.territory || 'Territory'}
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 active:bg-white/40 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`}
              />
            </button>
          </div>

          {/* Today's Progress */}
          <div className="bg-white/10 rounded-meat p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/90">Today's Target</span>
              <span className="text-lg font-bold">
                {todayAchievement.toFixed(0)}%
              </span>
            </div>
            <div className="progress-bar bg-white/20">
              <div
                className="h-full bg-white rounded-full transition-all duration-700"
                style={{ width: `${Math.min(todayAchievement, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-sm">
              <span className="text-white/80">
                R{metrics?.today.sales.toLocaleString()}
              </span>
              <span className="text-white/80">
                R{metrics?.today.target.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Today's Orders */}
          <div className="stat-card-green">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <ShoppingCart className="h-6 w-6 text-white/80" />
                <ArrowUpRight className="h-5 w-5 text-green-300" />
              </div>
              <p className="text-3xl font-bold mb-1">
                {metrics?.today.orders || 0}
              </p>
              <p className="text-green-100 text-sm">Orders Today</p>
            </div>
          </div>

          {/* Customers Visited */}
          <div className="stat-card-gold">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-6 w-6 text-white/80" />
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  {metrics?.today.completed}/{metrics?.today.visits}
                </span>
              </div>
              <p className="text-3xl font-bold mb-1">
                {metrics?.today.completed || 0}
              </p>
              <p className="text-yellow-100 text-sm">Visits Done</p>
            </div>
          </div>

          {/* Avg Order Value */}
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-white/80" />
              <span className="text-xs text-white/80">Avg Order</span>
            </div>
            <p className="text-2xl font-bold font-mono">
              R{((metrics?.today.sales || 0) / (metrics?.today.orders || 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>

          {/* Monthly Progress */}
          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-white/80" />
              <span className="text-xs text-white/80">This Month</span>
            </div>
            <p className="text-2xl font-bold">
              {metrics?.thisMonth.achievement.toFixed(0)}%
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="font-bold text-neutral-brown mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => router.push('/orders/new')}
              className="btn-primary"
            >
              <Plus className="h-5 w-5" />
              <span>New Order</span>
            </button>
            <button
              onClick={() => router.push('/inventory')}
              className="btn-secondary"
            >
              <Package className="h-5 w-5" />
              <span>Check Stock</span>
            </button>
            <button
              onClick={() => router.push('/customers')}
              className="btn-secondary"
            >
              <Users className="h-5 w-5" />
              <span>Customers</span>
            </button>
            <button
              onClick={() => router.push('/analytics')}
              className="btn-secondary"
            >
              <TrendingUp className="h-5 w-5" />
              <span>My KPIs</span>
            </button>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-neutral-brown">Alerts</h3>
              <span className="badge-danger text-xxs">{alerts.length}</span>
            </div>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-meat border ${getAlertColor(
                    alert.priority
                  )}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      {alert.actionLabel && (
                        <button className="text-xs font-semibold mt-2 hover:underline">
                          {alert.actionLabel} →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Orders */}
        {pendingOrders.length > 0 && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-neutral-brown">
                Pending Orders ({pendingOrders.length})
              </h3>
              <button
                onClick={() => router.push('/orders')}
                className="text-sm text-meat-red font-semibold hover:underline"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {pendingOrders.slice(0, 3).map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  compact={true}
                  onClick={() => router.push(`/orders/${order.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Today's Orders */}
        {todayOrders.length > 0 && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-neutral-brown">
                Today's Orders ({todayOrders.length})
              </h3>
              <button
                onClick={() => router.push('/orders')}
                className="text-sm text-meat-red font-semibold hover:underline"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {todayOrders.slice(0, 3).map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  compact={true}
                  onClick={() => router.push(`/orders/${order.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {todayOrders.length === 0 && !ordersLoading && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <ShoppingCart className="w-full h-full" />
            </div>
            <h3 className="empty-state-title">No Orders Yet Today</h3>
            <p className="empty-state-description">
              Start your day by creating a new order or visiting a customer
            </p>
            <button
              onClick={() => router.push('/orders/new')}
              className="btn-primary"
            >
              <Plus className="h-5 w-5" />
              <span>Create First Order</span>
            </button>
          </div>
        )}

        {/* Bottom Padding for Navigation */}
        <div className="h-4"></div>
      </div>
    </MobileLayout>
  );
}
