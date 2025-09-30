'use client';

import React, { useState, useEffect } from 'react';
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
  Minus,
  Trophy,
  Zap,
  Clock,
  Star,
  Calendar,
} from 'lucide-react';
import MobileLayout from '@/components/MobileLayout';
import { analyticsService } from '@/lib/api';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock KPI data (will be replaced with real API data)
  const mockKPIs = {
    monthlyTarget: 250000,
    currentSales: 180450,
    newCustomers: { current: 8, target: 10 },
    ordersPlaced: { current: 45, target: 40 },
    avgOrderValue: { current: 4010, target: 5000 },
    responseTime: { current: 2.3, target: 3 },
  };

  const mockSalesFunnel = {
    prospects: 45,
    contacted: 32,
    quoted: 18,
    closed: 12,
  };

  const mockTopProducts = [
    { name: 'Prime Ribeye Steaks', revenue: 45600, units: 152 },
    { name: 'Wagyu Beef Burgers', revenue: 32400, units: 324 },
    { name: 'Chicken Breast', revenue: 28900, units: 578 },
  ];

  const mockAchievements = [
    { icon: Trophy, label: 'Top Performer', description: 'This Week' },
    { icon: Zap, label: '5 Day Streak', description: 'Orders Daily' },
    { icon: Star, label: 'Premium Seller', description: 'Elite Status' },
  ];

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, fetch real data:
      // const data = await analyticsService.getPerformance(period);
      
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchAnalytics(true);
  };

  const getKPIStatus = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return 'excellent';
    if (percentage >= 80) return 'good';
    if (percentage >= 60) return 'warning';
    return 'danger';
  };

  const getKPIColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-700';
      case 'good':
        return 'text-blue-700';
      case 'warning':
        return 'text-yellow-700';
      case 'danger':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-gradient-to-r from-green-500 to-green-600';
      case 'good':
        return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
      case 'danger':
        return 'bg-gradient-to-r from-red-500 to-red-600';
      default:
        return 'bg-gray-500';
    }
  };

  const getTrendIcon = (current: number, target: number) => {
    if (current >= target) return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    if (current >= target * 0.8) return <Minus className="h-4 w-4 text-yellow-500" />;
    return <ArrowDownRight className="h-4 w-4 text-red-500" />;
  };

  if (loading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="spinner-lg mb-4"></div>
            <p className="text-neutral-brown-light">Loading analytics...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  const salesPercentage = (mockKPIs.currentSales / mockKPIs.monthlyTarget) * 100;
  const newCustomersPercentage = (mockKPIs.newCustomers.current / mockKPIs.newCustomers.target) * 100;
  const ordersPercentage = (mockKPIs.ordersPlaced.current / mockKPIs.ordersPlaced.target) * 100;
  const avgOrderPercentage = (mockKPIs.avgOrderValue.current / mockKPIs.avgOrderValue.target) * 100;
  const responsePercentage = ((mockKPIs.responseTime.target - mockKPIs.responseTime.current) / mockKPIs.responseTime.target) * 100;

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 space-y-4">
          {/* Title and Actions */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-brown">My Performance</h1>
              <p className="text-sm text-neutral-brown-light">
                Track your KPIs and targets
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 hover:bg-gray-100 rounded-meat transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`h-5 w-5 text-neutral-brown ${
                  refreshing ? 'animate-spin' : ''
                }`}
              />
            </button>
          </div>

          {/* Period Selector */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-meat p-1">
            <button
              onClick={() => setPeriod('daily')}
              className={`flex-1 px-4 py-2 rounded transition-colors ${
                period === 'daily'
                  ? 'bg-white shadow-sm font-semibold text-meat-red'
                  : 'text-neutral-brown hover:bg-gray-200'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setPeriod('weekly')}
              className={`flex-1 px-4 py-2 rounded transition-colors ${
                period === 'weekly'
                  ? 'bg-white shadow-sm font-semibold text-meat-red'
                  : 'text-neutral-brown hover:bg-gray-200'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              className={`flex-1 px-4 py-2 rounded transition-colors ${
                period === 'monthly'
                  ? 'bg-white shadow-sm font-semibold text-meat-red'
                  : 'text-neutral-brown hover:bg-gray-200'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          {/* Monthly Target Card */}
          <div className="card bg-gradient-to-r from-meat-red to-meat-red-light text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/80 text-sm mb-1">Monthly Target</p>
                <p className="text-3xl font-bold font-mono">R{mockKPIs.monthlyTarget.toLocaleString()}</p>
              </div>
              <Target className="h-12 w-12 text-white/30" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/90">Current Sales</span>
                <span className="font-bold">R{mockKPIs.currentSales.toLocaleString()}</span>
              </div>
              <div className="progress-bar bg-white/20">
                <div
                  className="h-full bg-white rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(salesPercentage, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/90">Achievement</span>
                <span className="font-bold">{salesPercentage.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* KPIs Grid */}
          <div className="space-y-4">
            <h3 className="font-bold text-neutral-brown flex items-center gap-2">
              <Award className="h-5 w-5 text-meat-red" />
              Key Performance Indicators
            </h3>

            {/* New Customers KPI */}
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-brown">New Customers</h4>
                    <p className="text-xs text-neutral-brown-light">This month</p>
                  </div>
                </div>
                {getTrendIcon(mockKPIs.newCustomers.current, mockKPIs.newCustomers.target)}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-neutral-brown">
                    {mockKPIs.newCustomers.current}
                  </span>
                  <span className="text-sm text-neutral-brown-light">
                    / {mockKPIs.newCustomers.target} target
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      getProgressBarColor(getKPIStatus(mockKPIs.newCustomers.current, mockKPIs.newCustomers.target))
                    }`}
                    style={{ width: `${Math.min(newCustomersPercentage, 100)}%` }}
                  />
                </div>
                <p className={`text-sm font-semibold ${getKPIColor(getKPIStatus(mockKPIs.newCustomers.current, mockKPIs.newCustomers.target))}`}>
                  {newCustomersPercentage.toFixed(0)}% achieved
                </p>
              </div>
            </div>

            {/* Orders Placed KPI */}
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-brown">Orders Placed</h4>
                    <p className="text-xs text-neutral-brown-light">This month</p>
                  </div>
                </div>
                {getTrendIcon(mockKPIs.ordersPlaced.current, mockKPIs.ordersPlaced.target)}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-neutral-brown">
                    {mockKPIs.ordersPlaced.current}
                  </span>
                  <span className="text-sm text-neutral-brown-light">
                    / {mockKPIs.ordersPlaced.target} target
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      getProgressBarColor(getKPIStatus(mockKPIs.ordersPlaced.current, mockKPIs.ordersPlaced.target))
                    }`}
                    style={{ width: `${Math.min(ordersPercentage, 100)}%` }}
                  />
                </div>
                <p className={`text-sm font-semibold ${getKPIColor(getKPIStatus(mockKPIs.ordersPlaced.current, mockKPIs.ordersPlaced.target))}`}>
                  {ordersPercentage.toFixed(0)}% achieved
                </p>
              </div>
            </div>

            {/* Avg Order Value KPI */}
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-brown">Average Order Value</h4>
                    <p className="text-xs text-neutral-brown-light">Per order</p>
                  </div>
                </div>
                {getTrendIcon(mockKPIs.avgOrderValue.current, mockKPIs.avgOrderValue.target)}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-neutral-brown font-mono">
                    R{mockKPIs.avgOrderValue.current.toLocaleString()}
                  </span>
                  <span className="text-sm text-neutral-brown-light">
                    / R{mockKPIs.avgOrderValue.target.toLocaleString()} target
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      getProgressBarColor(getKPIStatus(mockKPIs.avgOrderValue.current, mockKPIs.avgOrderValue.target))
                    }`}
                    style={{ width: `${Math.min(avgOrderPercentage, 100)}%` }}
                  />
                </div>
                <p className={`text-sm font-semibold ${getKPIColor(getKPIStatus(mockKPIs.avgOrderValue.current, mockKPIs.avgOrderValue.target))}`}>
                  {avgOrderPercentage.toFixed(0)}% of target
                </p>
              </div>
            </div>

            {/* Response Time KPI */}
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-brown">Response Time</h4>
                    <p className="text-xs text-neutral-brown-light">Average hours</p>
                  </div>
                </div>
                {getTrendIcon(mockKPIs.responseTime.target - mockKPIs.responseTime.current, mockKPIs.responseTime.target)}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-neutral-brown">
                    {mockKPIs.responseTime.current}h
                  </span>
                  <span className="text-sm text-neutral-brown-light">
                    / {mockKPIs.responseTime.target}h target
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-green-500 to-green-600"
                    style={{ width: `${Math.min(responsePercentage, 100)}%` }}
                  />
                </div>
                <p className="text-sm font-semibold text-green-700">
                  Excellent performance!
                </p>
              </div>
            </div>
          </div>

          {/* Sales Funnel */}
          <div className="card">
            <h3 className="font-bold text-neutral-brown mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-meat-red" />
              Sales Funnel
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-neutral-brown">Prospects</span>
                    <span className="text-sm font-bold text-neutral-brown">{mockSalesFunnel.prospects}</span>
                  </div>
                  <div className="h-8 bg-blue-500 rounded-meat"></div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-neutral-brown">Contacted</span>
                    <span className="text-sm font-bold text-neutral-brown">{mockSalesFunnel.contacted}</span>
                  </div>
                  <div className="h-8 bg-green-500 rounded-meat" style={{ width: `${(mockSalesFunnel.contacted / mockSalesFunnel.prospects) * 100}%` }}></div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-neutral-brown">Quoted</span>
                    <span className="text-sm font-bold text-neutral-brown">{mockSalesFunnel.quoted}</span>
                  </div>
                  <div className="h-8 bg-yellow-500 rounded-meat" style={{ width: `${(mockSalesFunnel.quoted / mockSalesFunnel.prospects) * 100}%` }}></div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-neutral-brown">Closed</span>
                    <span className="text-sm font-bold text-neutral-brown">{mockSalesFunnel.closed}</span>
                  </div>
                  <div className="h-8 bg-meat-red rounded-meat" style={{ width: `${(mockSalesFunnel.closed / mockSalesFunnel.prospects) * 100}%` }}></div>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-brown">Conversion Rate</span>
                  <span className="text-lg font-bold text-meat-red">
                    {((mockSalesFunnel.closed / mockSalesFunnel.prospects) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="card">
            <h3 className="font-bold text-neutral-brown mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-premium-gold" />
              Top Products This Month
            </h3>
            <div className="space-y-3">
              {mockTopProducts.map((product, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-meat">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0 ? 'bg-premium-gold' : index === 1 ? 'bg-gray-400' : 'bg-yellow-700'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-neutral-brown">{product.name}</p>
                    <p className="text-xs text-neutral-brown-light">{product.units} units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-meat-red">R{product.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="card">
            <h3 className="font-bold text-neutral-brown mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-meat-red" />
              Achievements
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {mockAchievements.map((achievement, index) => (
                <div key={index} className="text-center p-3 bg-gradient-to-br from-premium-gold to-premium-gold-light rounded-meat text-white">
                  <achievement.icon className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-xs font-semibold">{achievement.label}</p>
                  <p className="text-xxs opacity-90 mt-1">{achievement.description}</p>
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
