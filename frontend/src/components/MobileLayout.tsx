'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Bell,
  Menu,
  X,
  RefreshCw,
  Wifi,
  WifiOff,
  User,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getNetworkStatus, syncPendingOrders } from '@/lib/api';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [showMenu, setShowMenu] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      const status = getNetworkStatus();
      setIsOnline(status.isOnline);
      setPendingCount(status.pendingRequests);
    };

    checkStatus();
    window.addEventListener('online', checkStatus);
    window.addEventListener('offline', checkStatus);
    const interval = setInterval(checkStatus, 10000);

    return () => {
      window.removeEventListener('online', checkStatus);
      window.removeEventListener('offline', checkStatus);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (isOnline && pendingCount > 0) {
      handleSync();
    }
  }, [isOnline]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncPendingOrders();
      const status = getNetworkStatus();
      setPendingCount(status.pendingRequests);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Package, label: 'Products', path: '/inventory' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: ShoppingCart, label: 'Orders', path: '/orders' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      {/* Offline Banner */}
      {!isOnline && (
        <div className="offline-banner flex items-center justify-center gap-2">
          <WifiOff className="h-4 w-4" />
          <span>Offline Mode</span>
          {pendingCount > 0 && (
            <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
              {pendingCount} pending
            </span>
          )}
        </div>
      )}

      {/* Sync Banner */}
      {isOnline && pendingCount > 0 && (
        <div className="bg-blue-500 text-white text-center py-2 text-sm font-semibold flex items-center justify-center gap-2">
          {syncing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Syncing {pendingCount} orders...</span>
            </>
          ) : (
            <>
              <Wifi className="h-4 w-4" />
              <span>{pendingCount} orders pending sync</span>
              <button
                onClick={handleSync}
                className="ml-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold hover:bg-white/30"
              >
                Sync Now
              </button>
            </>
          )}
        </div>
      )}

      {/* Modern Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 safe-top flex-shrink-0 shadow-sm">
        <div className="flex items-center justify-between">
          {/* Logo & User */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-600 to-rose-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-rose-500/25">
              🥩
            </div>
            <div>
              <h1 className="text-xl font-display font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                SA Meat Market
              </h1>
              <p className="text-xs text-gray-600">
                {user?.profile.firstName || 'Salesperson'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button className="btn-icon relative">
              <Bell className="h-5 w-5 text-gray-700" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-600 rounded-full"></span>
            </button>

            {/* Menu */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="btn-icon"
            >
              {showMenu ? (
                <X className="h-5 w-5 text-gray-700" />
              ) : (
                <Menu className="h-5 w-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Side Menu Overlay */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setShowMenu(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-80 bg-white z-50 shadow-2xl animate-slide-up">
            <div className="p-6 space-y-6">
              {/* User Profile */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-600 to-rose-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {user?.profile.firstName?.[0] || 'S'}
                  {user?.profile.lastName?.[0] || 'J'}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {user?.profile.firstName} {user?.profile.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{user?.role}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {user?.profile.territory || 'Territory'}
                  </p>
                </div>
              </div>

              {/* Menu Items */}
              <nav className="space-y-2">
                <button
                  onClick={() => {
                    router.push('/profile');
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-900">My Profile</span>
                </button>
                <button
                  onClick={() => {
                    router.push('/settings');
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <Settings className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Settings</span>
                </button>
                <button
                  onClick={() => {
                    router.push('/help');
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <HelpCircle className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Help & Support</span>
                </button>
              </nav>

              {/* Network Status */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm">
                  {isOnline ? (
                    <>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-emerald-700 font-medium">Online</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-red-700 font-medium">Offline</span>
                    </>
                  )}
                </div>
                {pendingCount > 0 && (
                  <p className="text-xs text-gray-600 mt-2">
                    {pendingCount} orders pending sync
                  </p>
                )}
              </div>

              {/* Logout */}
              <button
                onClick={() => {
                  router.push('/auth/login');
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto scrollbar-thin pb-24">
        {children}
      </main>

      {/* Modern Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 safe-bottom z-30 shadow-lg">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-rose-50 to-pink-50 text-rose-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon
                  className={`h-6 w-6 transition-all ${active ? 'scale-110' : ''}`}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span
                  className={`text-xs font-medium ${
                    active ? 'font-semibold' : 'font-normal'
                  }`}
                >
                  {item.label}
                </span>
                {active && (
                  <div className="w-1.5 h-1.5 bg-rose-600 rounded-full mt-0.5"></div>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
