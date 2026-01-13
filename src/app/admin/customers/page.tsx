'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  ChevronDown,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  DollarSign,
  User,
  MoreVertical,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { format } from 'date-fns';

export default function AdminCustomersPage() {
  const { users } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const customers = users.filter((u) => u.role === 'customer');

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
  const totalOrders = customers.reduce((sum, c) => sum + (c.orders || 0), 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Customers</h1>
        <p className="text-[var(--color-text-light)]">
          Manage your customer base
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <User className="w-8 h-8 text-[var(--color-primary)]" />
          </div>
          <h3 className="text-2xl font-bold">{totalCustomers}</h3>
          <p className="text-sm text-[var(--color-text-light)]">Total Customers</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold">${totalRevenue.toFixed(2)}</h3>
          <p className="text-sm text-[var(--color-text-light)]">Total Revenue</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <ShoppingBag className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold">{totalOrders}</h3>
          <p className="text-sm text-[var(--color-text-light)]">Total Orders</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-purple-500" />
          </div>
          <h3 className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</h3>
          <p className="text-sm text-[var(--color-text-light)]">Avg. Order Value</p>
        </motion.div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-light)]" />
        <input
          type="text"
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] bg-white"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">
                  Joined
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">
                  Orders
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">
                  Total Spent
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--color-text)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filteredCustomers.map((customer) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white font-bold">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--color-text)]">
                          {customer.name}
                        </p>
                        <p className="text-sm text-[var(--color-text-light)]">
                          ID: {customer.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-[var(--color-text-light)]" />
                        <span>{customer.email}</span>
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-[var(--color-text-light)]" />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-[var(--color-text-light)]" />
                      <span>
                        {format(new Date(customer.createdAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-[var(--color-text-light)]" />
                      <span className="font-medium">{customer.orders || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-[var(--color-primary)]">
                      ${(customer.totalSpent || 0).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-[var(--color-text-light)]" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 mx-auto mb-4 text-[var(--color-text-light)]" />
            <p className="text-[var(--color-text)]">No customers found</p>
          </div>
        )}
      </div>
    </div>
  );
}
