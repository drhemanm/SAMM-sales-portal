'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Bell,
  Moon,
  Sun,
  Globe,
  DollarSign,
  Lock,
  Smartphone,
  Mail,
  MessageSquare,
  Shield,
  Download,
  Trash2,
  RefreshCw,
  Info,
  CheckCircle,
  ChevronRight,
} from 'lucide-react';
import MobileLayout from '@/components/MobileLayout';
import { useAuthStore } from '@/store/authStore';

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  // Notification Settings
  const [notifications, setNotifications] = useState({
    email: user?.settings.notifications.email ?? true,
    sms: user?.settings.notifications.sms ?? true,
    push: user?.settings.notifications.push ?? true,
  });

  // Preferences
  const [theme, setTheme] = useState<'light' | 'dark'>(
    user?.settings.preferences.theme ?? 'light'
  );
  const [language, setLanguage] = useState(
    user?.settings.preferences.language ?? 'en'
  );
  const [currency, setCurrency] = useState(
    user?.settings.preferences.currency ?? 'ZAR'
  );

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, update Firestore here
      // await updateDoc(doc(db, 'users', user.id), { settings: { notifications, preferences: { theme, language, currency } } });
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleClearCache = () => {
    if (confirm('Clear all cached data? This will refresh all data from the server.')) {
      localStorage.clear();
      alert('Cache cleared successfully!');
      window.location.reload();
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion requested. Please contact your administrator to complete this process.');
    }
  };

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-500 text-white">
          <div className="p-6 pb-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => router.back()}
                className="p-3 bg-white/20 backdrop-blur-xl rounded-xl hover:bg-white/30 transition-all"
              >
                <ArrowLeft className="h-6 w-6 text-white" />
              </button>
              {saved && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500 rounded-xl animate-slide-up">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-semibold">Saved</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold">Settings</h1>
                <p className="text-white/90 text-sm mt-1">
                  Customize your experience
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 bg-gray-50 space-y-4">
          {/* Notifications */}
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-indigo-600" />
              Notifications
            </h3>
            <div className="space-y-4">
              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email Notifications</p>
                    <p className="text-xs text-gray-600">Receive updates via email</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) =>
                      setNotifications({ ...notifications, email: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {/* SMS Notifications */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">SMS Notifications</p>
                    <p className="text-xs text-gray-600">Receive text messages</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.sms}
                    onChange={(e) =>
                      setNotifications({ ...notifications, sms: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Push Notifications</p>
                    <p className="text-xs text-gray-600">App notifications</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={(e) =>
                      setNotifications({ ...notifications, push: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              {theme === 'light' ? (
                <Sun className="h-5 w-5 text-yellow-600" />
              ) : (
                <Moon className="h-5 w-5 text-indigo-600" />
              )}
              Appearance
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Theme
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      theme === 'light'
                        ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300 shadow-lg'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Sun className={`h-5 w-5 ${theme === 'light' ? 'text-yellow-600' : 'text-gray-600'}`} />
                    <span className={`font-semibold ${theme === 'light' ? 'text-yellow-900' : 'text-gray-700'}`}>
                      Light
                    </span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-300 shadow-lg'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Moon className={`h-5 w-5 ${theme === 'dark' ? 'text-indigo-600' : 'text-gray-600'}`} />
                    <span className={`font-semibold ${theme === 'dark' ? 'text-indigo-900' : 'text-gray-700'}`}>
                      Dark
                    </span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Dark mode coming soon
                </p>
              </div>
            </div>
          </div>

          {/* Language & Region */}
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              Language & Region
            </h3>
            <div className="space-y-3">
              {/* Language */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="select-field"
                >
                  <option value="en">English</option>
                  <option value="af">Afrikaans</option>
                  <option value="zu">Zulu</option>
                  <option value="xh">Xhosa</option>
                </select>
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="select-field"
                >
                  <option value="ZAR">ZAR - South African Rand (R)</option>
                  <option value="USD">USD - US Dollar ($)</option>
                  <option value="EUR">EUR - Euro (€)</option>
                  <option value="GBP">GBP - British Pound (£)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-red-600" />
              Security
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => alert('Change password feature coming soon')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-gray-600" />
                  <span className="font-semibold text-gray-900">Change Password</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
              <button
                onClick={() => alert('Two-factor authentication feature coming soon')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-gray-600" />
                  <span className="font-semibold text-gray-900">Two-Factor Authentication</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Data & Storage */}
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Download className="h-5 w-5 text-green-600" />
              Data & Storage
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => alert('Export data feature coming soon')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Download className="h-5 w-5 text-gray-600" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Export My Data</p>
                    <p className="text-xs text-gray-600">Download all your data</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
              
              <button
                onClick={handleClearCache}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-5 w-5 text-gray-600" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Clear Cache</p>
                    <p className="text-xs text-gray-600">Free up storage space</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card border-2 border-red-200 bg-red-50">
            <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              Danger Zone
            </h3>
            <button
              onClick={handleDeleteAccount}
              className="w-full flex items-center justify-center gap-3 p-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors"
            >
              <Trash2 className="h-5 w-5" />
              <span>Delete Account</span>
            </button>
            <p className="text-xs text-red-700 mt-3 text-center">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
          </div>

          {/* App Information */}
          <div className="card bg-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-gray-600" />
              App Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Version</span>
                <span className="font-mono font-semibold text-gray-900">2.0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Build</span>
                <span className="font-mono font-semibold text-gray-900">2025.01.20</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Platform</span>
                <span className="font-semibold text-gray-900">Web</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                Check for Updates
              </button>
            </div>
          </div>

          {/* Bottom Padding */}
          <div className="h-4"></div>
        </div>

        {/* Save Button */}
        <div className="p-4 bg-white border-t border-gray-200 safe-bottom">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary w-full"
          >
            {saving ? (
              <>
                <div className="spinner"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}
