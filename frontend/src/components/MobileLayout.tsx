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
  Sparkles,
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
    <div className="h-screen flex flex-col overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-4000" />
      </div>

      {/* Offline Banner */}
      {!isOnline && (
        <div className="offline-banner flex items-center justify-center gap-2 animate-slide-down">
          <WifiOff className="h-4 w-4" />
          <span>Offline Mode</span>
          {pendingCount > 0 && (
            <span className="ml-2 bg-white/30 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-bold">
              {pendingCount} pending
            </span>
          )}
        </div>
      )}

      {/* Sync Banner */}
      {isOnline && pendingCount > 0 && (
        <div className="bg-primary/90 backdrop-blur-xl text-white text-center py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-blue animate-slide-down">
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
                className="ml-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold hover:bg-white/30 transition-all active:scale-95"
              >
                Sync Now
              </button>
            </>
          )}
        </div>
      )}

      {/* Apple Glass Header */}
      <header className="bg-white/70 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/50 px-6 py-4 safe-top flex-shrink-0 shadow-glass">
        <div className="flex items-center justify-between">
          {/* Logo & User */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-2xl shadow-blue">
                🥩
              </div>
              <div className="absolute -inset-0.5 bg-gradient-to-br from-primary-400 to-primary-500 rounded-2xl blur opacity-50 -z-10" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-gradient-primary">
                SA Meat Market
              </h1>
              <p className="text-xs text-neutral-600 font-medium">
                {user?.profile.firstName || 'Salesperson'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button className="btn-icon relative group">
              <Bell className="h-5 w-5 text-neutral-700 group-hover:text-primary-600 transition-colors" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full animate-pulse" />
              <div className="absolute -inset-0.5 bg-gradient-to-br from-primary-400/20 to-purple-400/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </button>

            {/* Menu */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="btn-icon group"
            >
              {showMenu ? (
                <X className="h-5 w-5 text-neutral-700 group-hover:text-primary-600 transition-colors" />
              ) : (
                <Menu className="h-5 w-5 text-neutral-700 group-hover:text-primary-600 transition-colors" />
              )}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-primary-400/20 to-purple-400/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </button>
          </div>
        </div>
      </header>

      {/* Side Menu Overlay */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-md z-40 animate-fade-in"
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-0 right-0 bottom-0 w-80 z-50 animate-slide-up">
            <div className="h-full bg-white/80 backdrop-blur-2xl backdrop-saturate-150 border-l border-white/50 shadow-2xl overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* User Profile Card */}
                <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-blue-lg">
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                          {user?.profile.firstName?.[0] || 'S'}
                          {user?.profile.lastName?.[0] || 'J'}
                        </div>
                        <div className="absolute -inset-1 bg-white/30 rounded-2xl blur -z-10" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {user?.profile.firstName} {user?.profile.lastName}
                        </h3>
                        <p className="text-sm text-white/80">{user?.role}</p>
                      </div>
                    </div>
                    {user?.profile.territory && (
                      <div className="flex items-center gap-2 text-sm text-white/90 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-xl">
                        <Sparkles className="h-4 w-4" />
                        <span>{user.profile.territory}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                </div>

                {/* Menu Items */}
                <nav className="space-y-2">
                  <button
                    onClick={() => {
                      router.push('/profile');
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/50 hover:bg-white/80 backdrop-blur-xl border border-white/50 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-100 group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-blue group-hover:scale-110 transition-transform">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold text-neutral-900">My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      router.push('/settings');
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/50 hover:bg-white/80 backdrop-blur-xl border border-white/50 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-100 group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-purple group-hover:scale-110 transition-transform">
                      <Settings className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold text-neutral-900">Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      router.push('/help');
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/50 hover:bg-white/80 backdrop-blur-xl border border-white/50 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-100 group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-teal group-hover:scale-110 transition-transform">
                      <HelpCircle className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold text-neutral-900">Help & Support</span>
                  </button>
                </nav>

                {/* Network Status */}
                <div className="pt-6 border-t border-white/50">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/50">
                    <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success' : 'bg-error'} ${isOnline ? 'animate-pulse' : ''}`} />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-neutral-600">Network Status</p>
                      <p className={`text-sm font-bold ${isOnline ? 'text-success-dark' : 'text-error-dark'}`}>
                        {isOnline ? 'Online' : 'Offline'}
                      </p>
                    </div>
                    {pendingCount > 0 && (
                      <span className="px-2 py-1 bg-warning/10 text-warning-dark text-xs font-bold rounded-lg">
                        {pendingCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={() => {
                    router.push('/auth/login');
                  }}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-error/10 hover:bg-error/20 backdrop-blur-xl text-error-dark font-semibold rounded-2xl transition-all duration-300 hover:scale-105 active:scale-100 border border-error/20"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto scrollbar-thin pb-24">
        {children}
      </main>

      {/* Apple Glass Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 safe-bottom">
        <div className="nav-glass px-2 py-3">
          <div className="flex items-center justify-around max-w-md mx-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`relative flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-2xl transition-all duration-300 ${
                    active
                      ? 'bg-primary/10 scale-110'
                      : 'hover:bg-white/50 hover:scale-105'
                  }`}
                >
                  {/* Active Indicator Glow */}
                  {active && (
                    <div className="absolute -inset-2 bg-gradient-to-br from-primary-400/30 to-purple-400/30 rounded-2xl blur-md -z-10 animate-pulse" />
                  )}
                  
                  {/* Icon */}
                  <div className={`relative ${active ? 'text-primary-600' : 'text-neutral-600'}`}>
                    <Icon
                      className={`h-6 w-6 transition-all duration-300 ${
                        active ? 'drop-shadow-md' : ''
                      }`}
                      strokeWidth={active ? 2.5 : 2}
                    />
                  </div>
                  
                  {/* Label */}
                  <span
                    className={`text-xs font-semibold transition-all duration-300 ${
                      active ? 'text-primary-700' : 'text-neutral-600'
                    }`}
                  >
                    {item.label}
                  </span>
                  
                  {/* Active Dot */}
                  {active && (
                    <div className="absolute -bottom-1 w-1 h-1 bg-primary-600 rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
