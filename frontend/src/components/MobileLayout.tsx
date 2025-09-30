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

  // Check network status
  useEffect(() => {
    const checkStatus = () => {
      const status = getNetworkStatus();
      setIsOnline(status.isOnline);
      setPendingCount(status.pendingRequests);
    };

    checkStatus();

    // Listen for online/offline events
    window.addEventListener('online', checkStatus);
    window.addEventListener('offline', checkStatus);

    // Check status every 10 seconds
    const interval = setInterval(checkStatus, 10000);

    return () => {
      window.removeEventListener('online', checkStatus);
      window.removeEventListener('offline', checkStatus);
      clearInterval(interval);
    };
  }, []);

  // Sync pending orders when coming back online
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
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: ShoppingCart, label: 'Orders', path: '/orders' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <div className="h-screen flex flex-col bg-neutral-cream overflow-hidden">
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

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 safe-top flex-shrink-0">
        <div className="flex items-center justify-between">
          {/* Logo & User */}
          <div className="flex items-center gap-3">
            <div className="text-3xl">🥩</div>
            <div>
              <h1 className="text-lg font-bold text-meat-red">SA Meat Market</h1>
              <p className="text-xs text-neutral-brown-light">
                {user?.profile.firstName || 'Salesperson'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button className="btn-icon relative">
              <Bell className="h-5 w-5 text-neutral-brown" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-meat-red rounded-full"></span>
            </button>

            {/* Menu */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="btn-icon"
            >
              {showMenu ? (
                <X className="h-5 w-5 text-neutral-brown" />
              ) : (
                <Menu className="h-5 w-5 text-neutral-brown" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Side Menu Overlay */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-80 bg-white z-50 shadow-2xl animate-slide-in">
            <div className="p-6 space-y-6">
              {/* User Profile */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                <div className="w-16 h-16 bg-meat-red rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.profile.firstName?.[0] || 'S'}
                  {user?.profile.lastName?.[0] || 'J'}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-neutral-brown">
                    {user?.profile.firstName} {user?.profile.lastName}
                  </h3>
                  <p className="text-sm text-neutral-brown-light">{user?.role}</p>
                  <p className="text-xs text-neutral-brown-light mt-1">
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
                  className="w-full text-left px-4 py-3 rounded-meat hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <span className="font-medium text-neutral-brown">My Profile</span>
                </button>
                <button
                  onClick={() => {
                    router.push('/settings');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-meat hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <span className="font-medium text-neutral-brown">Settings</span>
                </button>
                <button
                  onClick={() => {
                    router.push('/help');
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-meat hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <span className="font-medium text-neutral-brown">Help & Support</span>
                </button>
              </nav>

              {/* Network Status */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm">
                  {isOnline ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-700 font-medium">Online</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-red-700 font-medium">Offline</span>
                    </>
                  )}
                </div>
                {pendingCount > 0 && (
                  <p className="text-xs text-neutral-brown-light mt-2">
                    {pendingCount} orders pending sync
                  </p>
                )}
              </div>

              {/* Logout */}
              <button
                onClick={() => {
                  // Handle logout
                  router.push('/auth/login');
                }}
                className="w-full btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto scrollbar-thin pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom z-30">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-meat transition-colors ${
                  active
                    ? 'text-meat-red'
                    : 'text-neutral-brown-light hover:text-neutral-brown'
                }`}
              >
                <Icon
                  className={`h-6 w-6 ${active ? 'stroke-[2.5]' : 'stroke-2'}`}
                />
                <span
                  className={`text-xxs font-medium ${
                    active ? 'font-semibold' : 'font-normal'
                  }`}
                >
                  {item.label}
                </span>
                {active && (
                  <div className="w-1 h-1 bg-meat-red rounded-full mt-0.5"></div>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
