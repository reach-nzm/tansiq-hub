'use client';

import { motion } from 'framer-motion';
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Package,
} from 'lucide-react';
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
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Sample data
const monthlyRevenue = [
  { month: 'Jan', revenue: 12500, orders: 145, visitors: 3200 },
  { month: 'Feb', revenue: 15800, orders: 178, visitors: 3800 },
  { month: 'Mar', revenue: 18200, orders: 210, visitors: 4200 },
  { month: 'Apr', revenue: 16500, orders: 192, visitors: 3900 },
  { month: 'May', revenue: 21000, orders: 245, visitors: 4800 },
  { month: 'Jun', revenue: 24500, orders: 289, visitors: 5500 },
  { month: 'Jul', revenue: 28000, orders: 320, visitors: 6200 },
];

const categoryRevenue = [
  { name: 'Organic Foods', revenue: 35000, color: '#1a5f4a' },
  { name: 'Books', revenue: 25000, color: '#d4af37' },
  { name: 'Clothing', revenue: 28000, color: '#2d8a6e' },
  { name: 'Home & Decor', revenue: 18000, color: '#8b4513' },
  { name: 'Health & Beauty', revenue: 12000, color: '#e8c860' },
];

const topProducts = [
  { name: 'Premium Medjool Dates', sales: 245, revenue: 6122 },
  { name: 'Holy Quran - Leather Bound', sales: 189, revenue: 9451 },
  { name: 'Black Seed Oil', sales: 312, revenue: 5925 },
  { name: 'Premium Hijab Collection', sales: 278, revenue: 5554 },
  { name: 'Organic Sidr Honey', sales: 156, revenue: 5458 },
];

const trafficSources = [
  { name: 'Organic Search', value: 45, color: '#1a5f4a' },
  { name: 'Direct', value: 25, color: '#d4af37' },
  { name: 'Social Media', value: 18, color: '#2d8a6e' },
  { name: 'Referral', value: 12, color: '#8b4513' },
];

export default function AdminAnalyticsPage() {
  const stats = [
    {
      title: 'Total Revenue',
      value: '৳13,65,000',
      change: '+23.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: '1,579',
      change: '+18.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'bg-blue-500',
    },
    {
      title: 'Visitors',
      value: '31,600',
      change: '+12.8%',
      trend: 'up',
      icon: Eye,
      color: 'bg-purple-500',
    },
    {
      title: 'Conversion Rate',
      value: '4.99%',
      change: '-0.3%',
      trend: 'down',
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Analytics</h1>
        <p className="text-[var(--color-text-light)]">
          Track your store's performance
        </p>
      </div>

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
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
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

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-[var(--color-text)]">
                Revenue Trend
              </h3>
              <p className="text-sm text-[var(--color-text-light)]">
                Monthly revenue overview
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
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a5f4a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1a5f4a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="month" stroke="#6b6b6b" />
                <YAxis stroke="#6b6b6b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number | string | undefined) => {
                    const numValue = Number(value || 0);
                    return [`৳${numValue.toLocaleString()}`, 'Revenue'];
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1a5f4a"
                  strokeWidth={3}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Traffic Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold text-[var(--color-text)] mb-6">
            Traffic Sources
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficSources}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {trafficSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {trafficSources.map((source) => (
              <div key={source.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: source.color }}
                  />
                  <span className="text-[var(--color-text-light)]">{source.name}</span>
                </div>
                <span className="font-medium">{source.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Orders & Visitors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold text-[var(--color-text)] mb-6">
            Orders & Visitors
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="month" stroke="#6b6b6b" />
                <YAxis stroke="#6b6b6b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="orders" fill="#1a5f4a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="visitors" fill="#d4af37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold text-[var(--color-text)] mb-6">
            Revenue by Category
          </h3>
          <div className="space-y-4">
            {categoryRevenue.map((cat) => {
              const percentage = (cat.revenue / 118000) * 100;
              return (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[var(--color-text)]">{cat.name}</span>
                    <span className="text-sm font-medium">
                      ${cat.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1 }}
                      className="h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Top Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-2xl p-6 shadow-sm"
      >
        <h3 className="text-lg font-bold text-[var(--color-text)] mb-6">
          Top Selling Products
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text)]">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text)]">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text)]">
                  Sales
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text)]">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr
                  key={product.name}
                  className="border-b border-[var(--color-border)] last:border-0"
                >
                  <td className="px-4 py-4">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index < 3
                          ? 'bg-[var(--color-secondary)] text-[var(--color-primary-dark)]'
                          : 'bg-gray-100'
                      }`}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-[var(--color-text-light)]" />
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-medium">{product.sales}</td>
                  <td className="px-4 py-4 font-bold text-[var(--color-primary)]">
                    ${product.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
