'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  ChevronRight,
  ChevronDown,
  MapPin,
  Calendar,
  ShoppingBag
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { format } from 'date-fns';

const statusConfig = {
  pending: { 
    icon: Clock, 
    color: 'bg-gray-100 text-gray-700',
    bgColor: 'bg-gray-50',
    label: 'Order Placed'
  },
  processing: { 
    icon: Package, 
    color: 'bg-yellow-100 text-yellow-700',
    bgColor: 'bg-yellow-50',
    label: 'Processing'
  },
  shipped: { 
    icon: Truck, 
    color: 'bg-blue-100 text-blue-700',
    bgColor: 'bg-blue-50',
    label: 'Shipped'
  },
  delivered: { 
    icon: CheckCircle, 
    color: 'bg-green-100 text-green-700',
    bgColor: 'bg-green-50',
    label: 'Delivered'
  },
  cancelled: { 
    icon: XCircle, 
    color: 'bg-red-100 text-red-700',
    bgColor: 'bg-red-50',
    label: 'Cancelled'
  },
};

export default function OrdersPage() {
  const { currentUser, orders } = useStore();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filter orders for current user
  const userOrders = orders.filter(
    (order) => currentUser && order.customer.email === currentUser.email
  );

  const filteredOrders = userOrders.filter(
    (order) => filterStatus === 'all' || order.status === filterStatus
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-[var(--color-primary)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
            Please Sign In
          </h1>
          <p className="text-[var(--color-text-light)] mb-6">
            Log in to view your order history
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
        </motion.div>
      </div>
    );
  }

  if (userOrders.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        {/* Header */}
        <div className="bg-[var(--color-primary)] py-12">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-white"
            >
              <h1 className="text-4xl font-bold mb-2">My Orders</h1>
              <p className="text-white/80">طلباتي</p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-[var(--color-primary)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">
              No Orders Yet
            </h2>
            <p className="text-[var(--color-text-light)] mb-6">
              Start shopping to see your orders here
            </p>
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                Browse Products
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <div className="bg-[var(--color-primary)] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl font-bold mb-2">My Orders</h1>
            <p className="text-white/80">طلباتي</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Status Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(
            (status) => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-white text-[var(--color-text)] hover:bg-gray-50'
                }`}
              >
                {status === 'all' ? 'All Orders' : statusConfig[status as keyof typeof statusConfig]?.label || status}
              </motion.button>
            )
          )}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[var(--color-text-light)]">No orders found with this status</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const config = statusConfig[order.status];
              const StatusIcon = config.icon;
              const isExpanded = expandedOrder === order.id;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                >
                  {/* Order Header */}
                  <div
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${config.bgColor}`}>
                          <StatusIcon className={`w-6 h-6 ${config.color.split(' ')[1]}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-[var(--color-text)]">
                              Order #{order.id}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                              {config.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-[var(--color-text-light)]">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(order.createdAt), 'MMM d, yyyy')}
                            </span>
                            <span>{order.items.length} items</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-[var(--color-primary)]">
                          ${order.total.toFixed(2)}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-[var(--color-text-light)] transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Order Details (Expanded) */}
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-[var(--color-border)]"
                    >
                      {/* Order Items */}
                      <div className="p-6 space-y-4">
                        <h4 className="font-semibold text-[var(--color-text)]">Items</h4>
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <Link href={`/products/${item.id}`}>
                                <h5 className="font-medium text-[var(--color-text)] hover:text-[var(--color-primary)]">
                                  {item.name}
                                </h5>
                              </Link>
                              <p className="text-sm text-[var(--color-text-light)]">
                                Qty: {item.quantity} × ${item.price.toFixed(2)}
                              </p>
                            </div>
                            <span className="font-semibold text-[var(--color-text)]">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Shipping Info */}
                      <div className="px-6 pb-6">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="font-semibold text-[var(--color-text)] mb-3 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Shipping Address
                          </h4>
                          <div className="text-sm text-[var(--color-text-light)]">
                            <p className="font-medium text-[var(--color-text)]">{order.customer.name}</p>
                            <p>{order.customer.address}</p>
                            <p>{order.customer.city}, {order.customer.country}</p>
                            <p>{order.customer.phone}</p>
                          </div>
                        </div>
                      </div>

                      {/* Order Timeline */}
                      {order.status !== 'cancelled' && (
                        <div className="px-6 pb-6">
                          <h4 className="font-semibold text-[var(--color-text)] mb-4">Order Progress</h4>
                          <div className="flex items-center justify-between">
                            {['pending', 'processing', 'shipped', 'delivered'].map((status, index) => {
                              const stepConfig = statusConfig[status as keyof typeof statusConfig];
                              const StepIcon = stepConfig.icon;
                              const isCompleted = ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.status) >= index;
                              
                              return (
                                <div key={status} className="flex-1 flex flex-col items-center">
                                  <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                      isCompleted ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-400'
                                    }`}
                                  >
                                    <StepIcon className="w-5 h-5" />
                                  </div>
                                  <p className={`text-xs mt-2 ${isCompleted ? 'text-[var(--color-text)]' : 'text-gray-400'}`}>
                                    {stepConfig.label}
                                  </p>
                                  {index < 3 && (
                                    <div className="hidden sm:block absolute top-5 left-1/2 w-full h-0.5 bg-gray-200">
                                      <div
                                        className={`h-full bg-[var(--color-primary)] transition-all ${
                                          isCompleted ? 'w-full' : 'w-0'
                                        }`}
                                      />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="px-6 pb-6 flex gap-4">
                        <Link href="/contact" className="flex-1">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 border border-[var(--color-border)] text-[var(--color-text)] font-medium rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            Need Help?
                          </motion.button>
                        </Link>
                        {order.status === 'delivered' && (
                          <Link href="/products" className="flex-1">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full py-3 bg-[var(--color-primary)] text-white font-medium rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors"
                            >
                              Buy Again
                            </motion.button>
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
