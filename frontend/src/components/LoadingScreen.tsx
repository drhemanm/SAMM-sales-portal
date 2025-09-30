'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'light';
}

/**
 * Full Screen Loading Component
 * Can be used for page transitions or initial data loading
 */
export function LoadingScreen({
  message = 'Loading...',
  fullScreen = true,
  size = 'lg',
  variant = 'default',
}: LoadingScreenProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const variantClasses = {
    default: 'text-rose-600',
    primary: 'text-white',
    light: 'text-gray-400',
  };

  const containerClasses = fullScreen
    ? 'min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50'
    : 'flex items-center justify-center py-20';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        {/* Logo */}
        {fullScreen && (
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-rose-600 to-rose-500 rounded-2xl flex items-center justify-center text-4xl shadow-2xl animate-pulse">
            🥩
          </div>
        )}

        {/* Spinner */}
        <Loader2
          className={`${sizeClasses[size]} ${variantClasses[variant]} animate-spin mx-auto mb-4`}
        />

        {/* Message */}
        <p
          className={`font-medium ${
            variant === 'primary'
              ? 'text-white'
              : variant === 'light'
              ? 'text-gray-400'
              : 'text-gray-600'
          }`}
        >
          {message}
        </p>

        {/* App Name (full screen only) */}
        {fullScreen && (
          <p className="text-sm text-gray-500 mt-2">SA Meat Market Portal</p>
        )}
      </div>
    </div>
  );
}

/**
 * Card Skeleton Loader
 * For loading cards in lists
 */
export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card animate-pulse">
          <div className="flex items-start gap-4">
            {/* Avatar/Icon Skeleton */}
            <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>

            {/* Content Skeleton */}
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Table Skeleton Loader
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card">
      <div className="space-y-4 animate-pulse">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
        </div>

        {/* Rows */}
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Grid Skeleton Loader
 * For product grids
 */
export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card animate-pulse">
          {/* Image */}
          <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>

          {/* Content */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="flex items-center justify-between">
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              <div className="h-10 bg-gray-200 rounded-xl w-24"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Stats Cards Skeleton
 */
export function StatsCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card animate-pulse">
          <div className="w-12 h-12 bg-gray-200 rounded-xl mb-3"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}

/**
 * Inline Spinner
 * Small spinner for buttons and inline use
 */
export function InlineSpinner({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <Loader2
      className={`${sizeClasses[size]} animate-spin ${className}`}
    />
  );
}

/**
 * Chart Skeleton
 */
export function ChartSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="h-8 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="h-64 bg-gray-200 rounded-xl"></div>
    </div>
  );
}

/**
 * Profile Skeleton
 */
export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card animate-pulse">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-gray-200 rounded-2xl"></div>
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-6 bg-gray-200 rounded-full w-32"></div>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="card animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-12 bg-gray-200 rounded-xl"></div>
          <div className="h-12 bg-gray-200 rounded-xl"></div>
          <div className="h-12 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Detail Page Skeleton
 */
export function DetailPageSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="card animate-pulse">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-20 h-20 bg-gray-200 rounded-2xl"></div>
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="h-16 bg-gray-200 rounded-xl"></div>
          <div className="h-16 bg-gray-200 rounded-xl"></div>
          <div className="h-16 bg-gray-200 rounded-xl"></div>
        </div>
      </div>

      {/* Content Sections */}
      <CardSkeleton count={3} />
    </div>
  );
}

/**
 * Empty State Component
 */
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {action && (
        <button onClick={action.onClick} className="btn-primary">
          {action.label}
        </button>
      )}
    </div>
  );
}

/**
 * Error State Component
 */
interface ErrorStateProps {
  title?: string;
  message: string;
  retry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  retry,
}: ErrorStateProps) {
  return (
    <div className="card bg-red-50 border-red-200">
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="h-8 w-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-red-900 mb-2">{title}</h3>
        <p className="text-sm text-red-700 mb-4 max-w-md mx-auto">{message}</p>
        {retry && (
          <button onClick={retry} className="btn-secondary">
            <Loader2 className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
}

// Export all components as default for easy importing
export default {
  LoadingScreen,
  CardSkeleton,
  TableSkeleton,
  GridSkeleton,
  StatsCardsSkeleton,
  InlineSpinner,
  ChartSkeleton,
  ProfileSkeleton,
  DetailPageSkeleton,
  EmptyState,
  ErrorState,
};
