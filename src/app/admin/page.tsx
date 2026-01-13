'use client';

import { motion } from 'framer-motion';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Link from 'next/link';

// Sample data for charts
const revenueData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 },
  { name: 'Jun', revenue: 5500 },
  { name: 'Jul', revenue: 7000 },
];

const categoryData = [
  { name: 'Organic Foods', value: 35, color: '#1a5f4a' },
  { name: 'Books', value: 25, color: '#d4af37' },
  { name: 'Clothing', value: 20, color: '#2d8a6e' },
  { name: 'Home & Decor', value: 15, color: '#8b4513' },
  { name: 'Health & Beauty', value: 5, color: '#e8c860' },
];

const ordersData = [
  { name: 'Mon', orders: 12 },
  { name: 'Tue', orders: 19 },
  { name: 'Wed', orders: 15 },
  { name: 'Thu', orders: 22 },
  { name: 'Fri', orders: 28 },
  { name: 'Sat', orders: 35 },
  { name: 'Sun', orders: 30 },
];

export default function AdminDashboard() {
  const { products, orders, users } = useStore();

  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Orders',
      value: orders.length.toString(),
      change: '+15.3%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'bg-blue-500',
    },
    {
      title: 'Products',
      value: products.length.toString(),
      change: '+5.2%',
      trend: 'up',
      icon: Package,
      color: 'bg-purple-500',
    },
    {
      title: 'Customers',
      value: users.filter((u) => u.role === 'customer').length.toString(),
      change: '-2.4%',
      trend: 'down',
      icon: Users,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-text)]">
              {stat.value}
            </h3>
            <p className="text-sm text-[var(--color-text-light)]">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-[var(--color-text)]">
                Revenue Overview
              </h3>
              <p className="text-sm text-[var(--color-text-light)]">
                Monthly revenue for 2026
              </p>
            </div>
            <select className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none">
              <option>Last 7 months</option>
              <option>Last 12 months</option>
              <option>This year</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="name" stroke="#6b6b6b" />
                <YAxis stroke="#6b6b6b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1a5f4a"
                  strokeWidth={3}
                  dot={{ fill: '#1a5f4a', strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold text-[var(--color-text)] mb-6">
            Sales by Category
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-[var(--color-text-light)]">{cat.name}</span>
                </div>
                <span className="font-medium">{cat.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Orders Chart & Recent Orders */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Orders Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold text-[var(--color-text)] mb-6">
            Orders This Week
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="name" stroke="#6b6b6b" />
                <YAxis stroke="#6b6b6b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="orders" fill="#d4af37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[var(--color-text)]">
              Recent Orders
            </h3>
            <Link
              href="/admin/orders"
              className="text-[var(--color-primary)] text-sm font-medium hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-text)]">
                      {order.id}
                    </p>
                    <p className="text-sm text-[var(--color-text-light)]">
                      {order.customer.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[var(--color-primary)]">
                    ${order.total.toFixed(2)}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'delivered'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'shipped'
                        ? 'bg-blue-100 text-blue-700'
                        : order.status === 'processing'
                        ? 'bg-yellow-100 text-yellow-700'
                        : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Products & Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[var(--color-text)]">
              Top Selling Products
            </h3>
            <Link
              href="/admin/products"
              className="text-[var(--color-primary)] text-sm font-medium hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {products.slice(0, 5).map((product, index) => (
              <div
                key={product.id}
                className="flex items-center gap-4"
              >
                <span className="w-6 h-6 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-[var(--color-text)] line-clamp-1">
                    {product.name}
                  </p>
                  <p className="text-sm text-[var(--color-text-light)]">
                    {product.category}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[var(--color-primary)]">
                    ${product.price.toFixed(2)}
                  </p>
                  <p className="text-xs text-[var(--color-text-light)]">
                    {product.stock} in stock
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold text-[var(--color-text)] mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/admin/products/new"
              className="p-4 bg-[var(--color-primary)]/10 rounded-xl hover:bg-[var(--color-primary)]/20 transition-colors"
            >
              <Package className="w-8 h-8 text-[var(--color-primary)] mb-2" />
              <p className="font-medium text-[var(--color-text)]">Add Product</p>
              <p className="text-sm text-[var(--color-text-light)]">
                Create new product
              </p>
            </Link>
            <Link
              href="/admin/orders"
              className="p-4 bg-[var(--color-secondary)]/10 rounded-xl hover:bg-[var(--color-secondary)]/20 transition-colors"
            >
              <ShoppingCart className="w-8 h-8 text-[var(--color-secondary)] mb-2" />
              <p className="font-medium text-[var(--color-text)]">View Orders</p>
              <p className="text-sm text-[var(--color-text-light)]">
                Manage orders
              </p>
            </Link>
            <Link
              href="/admin/customers"
              className="p-4 bg-blue-500/10 rounded-xl hover:bg-blue-500/20 transition-colors"
            >
              <Users className="w-8 h-8 text-blue-500 mb-2" />
              <p className="font-medium text-[var(--color-text)]">Customers</p>
              <p className="text-sm text-[var(--color-text-light)]">
                View customers
              </p>
            </Link>
            <Link
              href="/admin/analytics"
              className="p-4 bg-purple-500/10 rounded-xl hover:bg-purple-500/20 transition-colors"
            >
              <Eye className="w-8 h-8 text-purple-500 mb-2" />
              <p className="font-medium text-[var(--color-text)]">Analytics</p>
              <p className="text-sm text-[var(--color-text-light)]">
                View reports
              </p>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
