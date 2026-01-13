'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Store,
  Mail,
  Phone,
  MapPin,
  Globe,
  Bell,
  Shield,
  Palette,
  Save,
  Upload,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Tansiq Hub',
    storeNameArabic: 'تنسيق هب',
    email: 'support@tansiqhub.com',
    phone: '+1 (555) 123-4567',
    address: '123 Islamic Center Rd, Suite 100',
    city: 'New York',
    country: 'United States',
    currency: 'USD',
    language: 'English',
    timezone: 'America/New_York',
  });

  const [notifications, setNotifications] = useState({
    orderConfirmation: true,
    orderShipped: true,
    orderDelivered: true,
    lowStock: true,
    newCustomer: false,
    dailyReport: true,
    weeklyReport: true,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Settings</h1>
        <p className="text-[var(--color-text-light)]">
          Manage your store configuration
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Store Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[var(--color-primary)]/10 rounded-xl">
              <Store className="w-6 h-6 text-[var(--color-primary)]" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Store Information</h2>
              <p className="text-sm text-[var(--color-text-light)]">
                Basic store details
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Store Name</label>
                <input
                  type="text"
                  value={storeSettings.storeName}
                  onChange={(e) =>
                    setStoreSettings({ ...storeSettings, storeName: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Store Name (Arabic)
                </label>
                <input
                  type="text"
                  value={storeSettings.storeNameArabic}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      storeNameArabic: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)]"
                  dir="rtl"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-light)]" />
                <input
                  type="email"
                  value={storeSettings.email}
                  onChange={(e) =>
                    setStoreSettings({ ...storeSettings, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-light)]" />
                <input
                  type="text"
                  value={storeSettings.phone}
                  onChange={(e) =>
                    setStoreSettings({ ...storeSettings, phone: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-light)]" />
                <input
                  type="text"
                  value={storeSettings.address}
                  onChange={(e) =>
                    setStoreSettings({ ...storeSettings, address: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  value={storeSettings.city}
                  onChange={(e) =>
                    setStoreSettings({ ...storeSettings, city: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Country</label>
                <input
                  type="text"
                  value={storeSettings.country}
                  onChange={(e) =>
                    setStoreSettings({ ...storeSettings, country: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Regional Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Globe className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Regional Settings</h2>
              <p className="text-sm text-[var(--color-text-light)]">
                Localization options
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Currency</label>
              <select
                value={storeSettings.currency}
                onChange={(e) =>
                  setStoreSettings({ ...storeSettings, currency: e.target.value })
                }
                className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="AED">AED - UAE Dirham</option>
                <option value="SAR">SAR - Saudi Riyal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select
                value={storeSettings.language}
                onChange={(e) =>
                  setStoreSettings({ ...storeSettings, language: e.target.value })
                }
                className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value="English">English</option>
                <option value="Arabic">العربية</option>
                <option value="French">Français</option>
                <option value="Turkish">Türkçe</option>
                <option value="Urdu">اردو</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Timezone</label>
              <select
                value={storeSettings.timezone}
                onChange={(e) =>
                  setStoreSettings({ ...storeSettings, timezone: e.target.value })
                }
                className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Asia/Dubai">Dubai (GST)</option>
                <option value="Asia/Riyadh">Riyadh (AST)</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[var(--color-secondary)]/20 rounded-xl">
              <Bell className="w-6 h-6 text-[var(--color-secondary)]" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Notifications</h2>
              <p className="text-sm text-[var(--color-text-light)]">
                Email notification preferences
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <label
                key={key}
                className="flex items-center justify-between cursor-pointer"
              >
                <span className="capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <div
                  onClick={() =>
                    setNotifications({ ...notifications, [key]: !value })
                  }
                  className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                    value ? 'bg-[var(--color-primary)]' : 'bg-gray-200'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform mt-0.5 ${
                      value ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </label>
            ))}
          </div>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-500/10 rounded-xl">
              <Shield className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Security</h2>
              <p className="text-sm text-[var(--color-text-light)]">
                Account security settings
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <button className="w-full py-3 px-4 border border-[var(--color-border)] rounded-xl hover:bg-gray-50 transition-colors text-left">
              <p className="font-medium">Change Password</p>
              <p className="text-sm text-[var(--color-text-light)]">
                Update your admin password
              </p>
            </button>

            <button className="w-full py-3 px-4 border border-[var(--color-border)] rounded-xl hover:bg-gray-50 transition-colors text-left">
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-[var(--color-text-light)]">
                Add an extra layer of security
              </p>
            </button>

            <button className="w-full py-3 px-4 border border-[var(--color-border)] rounded-xl hover:bg-gray-50 transition-colors text-left">
              <p className="font-medium">Login History</p>
              <p className="text-sm text-[var(--color-text-light)]">
                View recent login activity
              </p>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end"
      >
        <button className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors">
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </motion.div>
    </div>
  );
}
