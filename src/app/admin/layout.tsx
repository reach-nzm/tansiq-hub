'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  Tag,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Categories', href: '/admin/categories', icon: Tag },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser } = useStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Check if user is admin
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full" />
      </div>
    );
  }

  // Redirect non-admin users
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
            Access Denied
          </h1>
          <p className="text-[var(--color-text-light)] mb-6">
            You need administrator privileges to access this area.
          </p>
          <div className="flex gap-4">
            <Link href="/login" className="flex-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                Login as Admin
              </motion.button>
            </Link>
            <Link href="/" className="flex-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 border border-[var(--color-border)] text-[var(--color-text)] font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Go to Store
              </motion.button>
            </Link>
          </div>
          <p className="mt-6 text-xs text-[var(--color-text-light)]">
            Demo Admin: admin@tansiqhub.com / admin123
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[var(--color-primary-dark)] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-lg">Tansiq Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">3</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[var(--color-primary-dark)] text-white transform transition-transform duration-300 z-50 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--color-secondary)] rounded-lg flex items-center justify-center">
                <span className="text-[var(--color-primary-dark)] font-bold text-xl">T</span>
              </div>
              <div>
                <h1 className="font-bold text-lg">Tansiq Hub</h1>
                <p className="text-xs text-white/60">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[var(--color-secondary)] text-[var(--color-primary-dark)]'
                    : 'hover:bg-white/10'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Back to Store</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar - Desktop */}
        <header className="hidden lg:flex items-center justify-between bg-white px-6 py-4 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text)]">
              {navItems.find((item) => item.href === pathname)?.name || 'Dashboard'}
            </h2>
            <p className="text-sm text-[var(--color-text-light)]">
              Welcome back, Admin! 👋
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                3
              </span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
              <div>
                <p className="font-medium text-sm">Admin User</p>
                <p className="text-xs text-[var(--color-text-light)]">admin@tansiqhub.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6 mt-14 lg:mt-0">
          {children}
        </main>
      </div>
    </div>
  );
}
