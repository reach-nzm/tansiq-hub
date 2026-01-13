'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShoppingBag, 
  DollarSign, 
  LogOut, 
  Edit2, 
  Check 
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, setCurrentUser, orders } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(
    currentUser || {
      name: 'Guest User',
      email: 'guest@example.com',
      phone: '+1 (555) 123-4567',
    }
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-[var(--color-primary)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
            Please Sign In
          </h1>
          <p className="text-[var(--color-text-light)] mb-6">
            You need to log in to view your profile
          </p>
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              Go to Login
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  const userOrders = orders.filter((order) => 
    order.customer.email === currentUser.email
  );

  const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);

  const handleLogout = () => {
    setCurrentUser(null);
    router.push('/');
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // In a real app, this would update the user in the backend
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-3xl font-bold text-[var(--color-text)]">My Profile</h1>
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </motion.button>
        </motion.div>

        {/* Profile Card */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Main Profile */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-[var(--color-primary)]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[var(--color-text)]">
                    {userData.name}
                  </h2>
                  <p className="text-[var(--color-text-light)]">
                    {currentUser?.role === 'admin' ? 'Admin Account' : 'Customer Account'}
                  </p>
                </div>
              </div>
              <motion.button
                onClick={() => setIsEditing(!isEditing)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-xl hover:bg-[var(--color-primary)]/20 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                {isEditing ? 'Cancel' : 'Edit'}
              </motion.button>
            </div>

            {/* Profile Info */}
            {!isEditing ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[var(--color-primary)]" />
                  <div>
                    <p className="text-sm text-[var(--color-text-light)]">Email</p>
                    <p className="font-medium text-[var(--color-text)]">{userData.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[var(--color-primary)]" />
                  <div>
                    <p className="text-sm text-[var(--color-text-light)]">Phone</p>
                    <p className="font-medium text-[var(--color-text)]">
                      {userData.phone || 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
                  <div>
                    <p className="text-sm text-[var(--color-text-light)]">Member Since</p>
                    <p className="font-medium text-[var(--color-text)]">
                      {currentUser?.createdAt 
                        ? new Date(currentUser.createdAt).toLocaleDateString()
                        : 'Recently'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={userData.phone || ''}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  />
                </div>
                <motion.button
                  type="button"
                  onClick={handleSaveProfile}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Save Changes
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-light)]">Total Orders</p>
                  <p className="text-2xl font-bold text-[var(--color-text)]">
                    {userOrders.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-light)]">Total Spent</p>
                  <p className="text-2xl font-bold text-[var(--color-text)]">
                    ${totalSpent.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-light)]">Account Type</p>
                  <p className="text-2xl font-bold text-[var(--color-text)] capitalize">
                    {currentUser?.role || 'Customer'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Orders Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-xl font-bold text-[var(--color-text)] mb-6">Recent Orders</h3>

          {userOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-[var(--color-text)]">
                      Order ID
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-[var(--color-text)]">
                      Date
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-[var(--color-text)]">
                      Items
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-[var(--color-text)]">
                      Total
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-[var(--color-text)]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 font-medium text-[var(--color-primary)]">
                        {order.id.substring(0, 8)}...
                      </td>
                      <td className="py-4 px-4 text-[var(--color-text-light)]">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-[var(--color-text)]">
                        {order.items.length} items
                      </td>
                      <td className="py-4 px-4 font-semibold text-[var(--color-text)]">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-700'
                            : order.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-700'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-[var(--color-text-light)]">No orders yet</p>
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 px-6 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors"
                >
                  Start Shopping
                </motion.button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
