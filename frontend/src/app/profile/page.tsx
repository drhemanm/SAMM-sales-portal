'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Shield,
  LogOut,
  Camera,
  Edit2,
  Save,
  X,
  Award,
  TrendingUp,
  Target,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import MobileLayout from '@/components/MobileLayout';
import { useAuthStore } from '@/store/authStore';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    firstName: user?.profile.firstName || '',
    lastName: user?.profile.lastName || '',
    phone: user?.profile.phone || '',
  });
  const [saving, setSaving] = useState(false);

  // Mock performance data (will be replaced with real data)
  const performanceStats = {
    thisMonth: {
      sales: 2340000,
      orders: 145,
      newCustomers: 12,
    },
    thisYear: {
      sales: 18500000,
      orders: 1245,
      achievement: 87.3,
    },
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      try {
        await signOut(auth);
        logout();
        router.push('/auth/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, update Firebase & Firestore here
      // await updateProfile(auth.currentUser, { displayName: `${editedProfile.firstName} ${editedProfile.lastName}` });
      
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile({
      firstName: user?.profile.firstName || '',
      lastName: user?.profile.lastName || '',
      phone: user?.profile.phone || '',
    });
    setIsEditing(false);
  };

  const getRoleBadge = () => {
    switch (user?.role) {
      case 'admin':
        return { label: 'Administrator', color: 'bg-red-100 text-red-700 border-red-200' };
      case 'sales_manager':
        return { label: 'Sales Manager', color: 'bg-purple-100 text-purple-700 border-purple-200' };
      case 'salesperson':
        return { label: 'Salesperson', color: 'bg-blue-100 text-blue-700 border-blue-200' };
      default:
        return { label: 'User', color: 'bg-gray-100 text-gray-700 border-gray-200' };
    }
  };

  if (!user) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Not logged in</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  const roleBadge = getRoleBadge();

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-gradient-to-br from-rose-600 via-rose-500 to-pink-500 text-white">
          <div className="p-6 pb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-display font-bold">My Profile</h1>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-3 bg-white/20 backdrop-blur-xl rounded-xl hover:bg-white/30 transition-all"
                >
                  <Edit2 className="h-5 w-5 text-white" />
                </button>
              )}
            </div>

            {/* Profile Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {user.profile.firstName?.[0]}{user.profile.lastName?.[0]}
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center shadow-lg hover:bg-rose-700 transition-colors">
                      <Camera className="h-4 w-4 text-white" />
                    </button>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-1">
                    {user.profile.firstName} {user.profile.lastName}
                  </h2>
                  <p className="text-white/90 text-sm mb-3">{user.email}</p>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${roleBadge.color}`}>
                    <Shield className="h-3 w-3" />
                    {roleBadge.label}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 bg-gray-50 space-y-4">
          {/* Edit Mode Actions */}
          {isEditing && (
            <div className="card bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit2 className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Edit Mode Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="spinner"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Personal Information */}
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-rose-600" />
              Personal Information
            </h3>
            <div className="space-y-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.firstName}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, firstName: e.target.value })
                    }
                    className="input-field"
                    placeholder="Enter first name"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl">
                    <p className="font-medium text-gray-900">{user.profile.firstName}</p>
                  </div>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.lastName}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, lastName: e.target.value })
                    }
                    className="input-field"
                    placeholder="Enter last name"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl">
                    <p className="font-medium text-gray-900">{user.profile.lastName}</p>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedProfile.phone}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, phone: e.target.value })
                    }
                    className="input-field"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <a
                    href={`tel:${user.profile.phone}`}
                    className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <Phone className="h-5 w-5 text-gray-600" />
                    <p className="font-medium text-gray-900">{user.profile.phone}</p>
                  </a>
                )}
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                  <Mail className="h-5 w-5 text-gray-600" />
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed. Contact administrator for assistance.
                </p>
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Work Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-600">Role</span>
                <span className="text-sm font-bold text-gray-900 capitalize">
                  {roleBadge.label}
                </span>
              </div>
              {user.profile.territory && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600">Territory</span>
                  <span className="text-sm font-bold text-gray-900">
                    {user.profile.territory}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-600">Status</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          {user.role === 'salesperson' && (
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Performance Summary
              </h3>

              {/* This Month */}
              <div className="mb-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <p className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  This Month
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-700">
                      R{(performanceStats.thisMonth.sales / 1000).toFixed(0)}k
                    </p>
                    <p className="text-xs text-green-600 mt-1">Sales</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-700">
                      {performanceStats.thisMonth.orders}
                    </p>
                    <p className="text-xs text-green-600 mt-1">Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-700">
                      {performanceStats.thisMonth.newCustomers}
                    </p>
                    <p className="text-xs text-green-600 mt-1">New</p>
                  </div>
                </div>
              </div>

              {/* This Year */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <p className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  This Year
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-700">
                      R{(performanceStats.thisYear.sales / 1000000).toFixed(1)}M
                    </p>
                    <p className="text-xs text-blue-600 mt-1">Sales</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-700">
                      {performanceStats.thisYear.orders}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-700">
                      {performanceStats.thisYear.achievement}%
                    </p>
                    <p className="text-xs text-blue-600 mt-1">Target</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push('/analytics')}
                className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-600 transition-all flex items-center justify-center gap-2"
              >
                <span>View Full Analytics</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Quick Actions */}
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => router.push('/settings')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="font-semibold text-gray-900">Settings & Preferences</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>

              <button
                onClick={() => router.push('/help')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="font-semibold text-gray-900">Help & Support</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 border-2 border-red-200 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>

          {/* App Version */}
          <div className="text-center py-4">
            <p className="text-xs text-gray-500">SA Meat Market Portal</p>
            <p className="text-xs text-gray-400 mt-1">Version 2.0.0</p>
          </div>

          {/* Bottom Padding */}
          <div className="h-4"></div>
        </div>
      </div>
    </MobileLayout>
  );
}
