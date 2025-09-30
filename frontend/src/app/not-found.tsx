'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Home,
  ArrowLeft,
  Search,
  Package,
  Users,
  ShoppingCart,
  HelpCircle,
} from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  const quickLinks = [
    {
      icon: Home,
      label: 'Dashboard',
      path: '/',
      color: 'from-rose-500 to-pink-500',
    },
    {
      icon: Package,
      label: 'Products',
      path: '/inventory',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      icon: Users,
      label: 'Customers',
      path: '/customers',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: ShoppingCart,
      label: 'Orders',
      path: '/orders',
      color: 'from-purple-500 to-indigo-500',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="p-6">
        <div className="w-14 h-14 bg-gradient-to-br from-rose-600 to-rose-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
          🥩
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full text-center">
          {/* 404 Illustration */}
          <div className="mb-8 relative">
            <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600 font-display">
              404
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-32 bg-rose-100 rounded-full flex items-center justify-center animate-pulse">
                <Search className="h-16 w-16 text-rose-400" />
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Page Not Found
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Oops! The page you're looking for doesn't exist.
            </p>
            <p className="text-sm text-gray-500">
              It might have been moved or deleted.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-8">
            <button
              onClick={() => router.back()}
              className="btn-secondary w-full"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Go Back</span>
            </button>
            <button
              onClick={() => router.push('/')}
              className="btn-primary w-full"
            >
              <Home className="h-5 w-5" />
              <span>Go to Dashboard</span>
            </button>
          </div>

          {/* Quick Links */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-gray-700 mb-4">
              Or explore these pages:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => router.push(link.path)}
                  className="card p-4 hover:shadow-lg transition-all active:scale-95"
                >
                  <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-br ${link.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <link.icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {link.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Help Link */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center justify-center gap-2 text-blue-900">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Need help?</span>
            </div>
            <button
              onClick={() => router.push('/help')}
              className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Visit our Help Center
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <p className="text-xs text-gray-500">
          © 2025 SA Meat Market. All rights reserved.
        </p>
      </div>
    </div>
  );
}
