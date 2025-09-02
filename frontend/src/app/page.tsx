'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Filter, ShoppingCart, User, Package, TrendingUp, 
  Clock, Phone, MapPin, Star, Edit3, CheckCircle, AlertCircle, 
  DollarSign, BarChart3, PieChart, Users, Truck, Bell, Settings,
  Calendar, FileText, Target, Award, Zap, ArrowUpRight, ArrowDownRight,
  Eye, Download, RefreshCw, ChevronDown, ChevronRight, Menu, X
} from 'lucide-react';

// Mock data for demonstration
const dashboardMetrics = {
  today: {
    sales: 87450,
    orders: 23,
    customers: 8,
    avgOrderValue: 3800
  },
  thisMonth: {
    sales: 2340000,
    orders: 645,
    customers: 187,
    growth: 12.5
  },
  targets: {
    monthly: 2500000,
    quarterly: 7200000,
    achievement: 93.6
  }
};

const recentOrders = [
  {
    id: "ORD-2025-0847",
    customer: "The Ritz Carlton",
    salesperson: "Sarah Johnson",
    amount: 12450,
    status: "delivered",
    priority: "high",
    items: 15,
    delivery: "2025-09-02 14:30",
    temperature: "-2°C",
    feedback: 4.9
  },
  {
    id: "ORD-2025-0846",
    customer: "Butcher Block Restaurant",
    salesperson: "Mike Chen",
    amount: 8920,
    status: "in-transit",
    priority: "normal",
    items: 12,
    delivery: "2025-09-02 16:00",
    temperature: "-1.8°C",
    eta: "15 mins"
  },
  {
    id: "ORD-2025-0845",
    customer: "Fresh Market Sandton",
    salesperson: "David Wilson",
    amount: 15680,
    status: "processing",
    priority: "urgent",
    items: 24,
    delivery: "2025-09-03 08:00",
    temperature: "Pending"
  }
];

const topProducts = [
  {
    id: 1,
    name: "Prime Ribeye Steaks",
    category: "Premium Beef",
    sales: 45600,
    units: 152,
    margin: 28.5,
    trend: "up",
    stock: 67,
    reorderPoint: 20
  },
  {
    id: 2,
    name: "Wagyu Beef Burgers",
    category: "Ground Beef",
    sales: 32400,
    units: 324,
    margin: 35.2,
    trend: "up",
    stock: 12,
    reorderPoint: 50
  },
  {
    id: 3,
    name: "Free-Range Chicken Breast",
    category: "Poultry",
    sales: 28900,
    units: 578,
    margin: 22.1,
    trend: "down",
    stock: 234,
    reorderPoint: 100
  }
];

const alertsAndNotifications = [
  {
    id: 1,
    type: "stock",
    priority: "high",
    message: "Wagyu Beef Burgers below reorder point (12 kg remaining)",
    time: "5 mins ago",
    action: "Reorder Now"
  },
  {
    id: 2,
    type: "delivery",
    priority: "medium",
    message: "Order ORD-2025-0846 delayed by 20 minutes - customer notified",
    time: "12 mins ago",
    action: "Track"
  },
  {
    id: 3,
    type: "customer",
    priority: "low",
    message: "The Grand Hotel requested quote for upcoming event (500+ guests)",
    time: "1 hour ago",
    action: "Create Quote"
  }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [realTimeData, setRealTimeData] = useState(dashboardMetrics);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        today: {
          ...prev.today,
          sales: prev.today.sales + Math.floor(Math.random() * 2000),
          orders: prev.today.orders + (Math.random() > 0.7 ? 1 : 0)
        }
      }));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    const icons = {
      delivered: <CheckCircle className="h-4 w-4 text-green-500" />,
      'in-transit': <Truck className="h-4 w-4 text-blue-500" />,
      processing: <Clock className="h-4 w-4 text-yellow-500" />,
      cancelled: <X className="h-4 w-4 text-red-500" />
    };
    return icons[status] || <Clock className="h-4 w-4 text-gray-500" />;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      urgent: 'bg-red-200 text-red-900 border-red-300',
      normal: 'bg-blue-100 text-blue-800 border-blue-200',
      low: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[priority] || colors.normal;
  };

  interface StatCardProps {
    title: string;
    value: string;
    change?: string;
    icon: React.ElementType;
    trend?: 'up' | 'down';
    color?: string;
  }

  const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, trend, color = "blue" }) => (
    <div className={`bg-gradient-to-r from-${color}-500 to-${color}-600 p-6 rounded-xl text-white relative overflow-hidden`}>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <p className={`text-${color}-100 text-sm font-medium`}>{title}</p>
          <Icon className={`h-6 w-6 text-${color}-200`} />
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <div className="flex items-center mt-1">
                {trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4 text-green-300 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-300 mr-1" />
                )}
                <span className={`text-sm ${trend === 'up' ? 'text-green-300' : 'text-red-300'}`}>
                  {change}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-20">
        <Icon className="h-24 w-24" />
      </div>
    </div>
  );

  const Sidebar = () => (
    <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🥩</div>
          {!sidebarCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-gray-900">SA Meat Market</h1>
              <p className="text-xs text-gray-600">Sales Portal v2.0</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3, badge: null },
          { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: '23' },
          { id: 'customers', label: 'Customers', icon: Users, badge: null },
          { id: 'products', label: 'Products', icon: Package, badge: '3' },
          { id: 'inventory', label: 'Inventory', icon: Truck, badge: null },
          { id: 'analytics', label: 'Analytics', icon: PieChart, badge: null },
          { id: 'reports', label: 'Reports', icon: FileText, badge: null },
          { id: 'calendar', label: 'Calendar', icon: Calendar, badge: '5' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2 rounded-lg transition-colors ${
              activeTab === item.id
                ? 'bg-brand-50 text-brand-700 border border-brand-200'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-3">
              <item.icon className="h-5 w-5" />
              {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
            </div>
            {!sidebarCollapsed && item.badge && (
              <span className="bg-brand-100 text-brand-700 text-xs px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white font-medium">
            SJ
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
              <p className="text-xs text-gray-600">Sales Manager</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const Header = () => (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search orders, customers, products..."
              className="w-96 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>New Order</span>
            </button>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="h-5 w-5 text-gray-600" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
          </div>

          {/* Settings */}
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Settings className="h-5 w-5 text-gray-600" />
          </button>

          {/* Status Indicator */}
          <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Online</span>
          </div>
        </div>
      </div>
    </header>
  );

  const DashboardContent = () => (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
          title="Today's Revenue" 
          value={`R${realTimeData.today.sales.toLocaleString()}`}
          change="+8.2%"
          trend="up"
          icon={DollarSign}
          color="green"
        />
        <StatCard 
          title="Orders Today" 
          value={realTimeData.today.orders.toString()}
          change="+5 from yesterday"
          trend="up"
          icon={ShoppingCart}
          color="blue"
        />
        <StatCard 
          title="Active Customers" 
          value={realTimeData.today.customers.toString()}
          change="2 new this week"
          trend="up"
          icon={Users}
          color="purple"
        />
        <StatCard 
          title="Avg Order Value" 
          value={`R${realTimeData.today.avgOrderValue.toLocaleString()}`}
          change="+12.5%"
          trend="up"
          icon={Target}
          color="orange"
        />
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Monthly Performance</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Target: R{realTimeData.targets.monthly.toLocaleString()}</span>
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                {realTimeData.targets.achievement}%
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>R{realTimeData.thisMonth.sales.toLocaleString()}</span>
              <span>R{realTimeData.targets.monthly.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(realTimeData.targets.achievement, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Sales Chart Placeholder */}
          <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 font-medium">Sales Analytics Chart</p>
              <p className="text-sm text-gray-500">Real-time sales data visualization</p>
            </div>
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Alerts</h3>
            <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
              {alertsAndNotifications.length} active
            </div>
          </div>
          
          <div className="space-y-4">
            {alertsAndNotifications.map(alert => (
              <div key={alert.id} className={`p-4 rounded-lg border ${
                alert.priority === 'high' ? 'bg-red-50 border-red-200' :
                alert.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-600 mt-1">{alert.time}</p>
                  </div>
                  <AlertCircle className={`h-4 w-4 ${
                    alert.priority === 'high' ? 'text-red-500' :
                    alert.priority === 'medium' ? 'text-yellow-500' :
                    'text-blue-500'
                  }`} />
                </div>
                <button className="mt-2 text-xs font-medium text-brand-600 hover:text-brand-700">
                  {alert.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Recent Orders</h3>
          <div className="flex items-center space-x-3">
            <button className="text-brand-600 hover:text-brand-700 text-sm font-medium">
              View All
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <RefreshCw className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.id}</div>
                      <div className="text-sm text-gray-500">{order.items} items</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                      <div className="text-sm text-gray-500">{order.salesperson}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">R{order.amount.toLocaleString()}</div>
                    {order.feedback && (
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600 ml-1">{order.feedback}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2 mb-1">
                      {getStatusIcon(order.status)}
                      <span className="text-sm capitalize">{order.status.replace('-', ' ')}</span>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(order.priority)}`}>
                      {order.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.delivery}</div>
                    {order.eta && (
                      <div className="text-xs text-blue-600 font-medium">ETA: {order.eta}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-mono ${
                      order.temperature.includes('-') ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {order.temperature}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Eye className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Edit3 className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Download className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard' && <DashboardContent />}
          {activeTab !== 'dashboard' && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module
                </h3>
                <p className="text-gray-600 mb-6">
                  This section is under development with advanced features
                </p>
                <button className="btn-primary">
                  Coming Soon
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
