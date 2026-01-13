'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  ChevronDown,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Package,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
} from 'lucide-react';
import { useStore, Order } from '@/store/useStore';
import { format } from 'date-fns';

const statusOptions = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const statusIcons = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

const statusColors = {
  pending: 'bg-gray-100 text-gray-700',
  processing: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Orders</h1>
        <p className="text-[var(--color-text-light)]">
          Manage and track customer orders
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statusOptions.slice(1).map((status) => {
          const count = orders.filter((o) => o.status === status.value).length;
          const Icon = statusIcons[status.value as keyof typeof statusIcons];
          return (
            <motion.button
              key={status.value}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedStatus(status.value)}
              className={`p-4 rounded-xl transition-all ${
                selectedStatus === status.value
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-white shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-5 h-5" />
                <span className="text-2xl font-bold">{count}</span>
              </div>
              <p className="text-sm">{status.label}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-light)]" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] bg-white"
          />
        </div>
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="appearance-none px-4 py-3 pr-10 border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] bg-white cursor-pointer min-w-[180px]"
          >
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-light)] pointer-events-none" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--color-text)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filteredOrders.map((order) => {
                const StatusIcon = statusIcons[order.status];
                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-[var(--color-primary)]">
                        #{order.id}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-[var(--color-text)]">
                          {order.customer.name}
                        </p>
                        <p className="text-sm text-[var(--color-text-light)]">
                          {order.customer.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[var(--color-text)]">
                        {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                      </p>
                      <p className="text-sm text-[var(--color-text-light)]">
                        {format(new Date(order.createdAt), 'HH:mm')}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-[var(--color-text)]">
                        ${order.total.toFixed(2)}
                      </p>
                      <p className="text-sm text-[var(--color-text-light)]">
                        {order.items.length} items
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                          statusColors[order.status]
                        }`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-5 h-5 text-[var(--color-text-light)]" />
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusUpdate(order.id, e.target.value as Order['status'])
                          }
                          className="appearance-none px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 mx-auto mb-4 text-[var(--color-text-light)]" />
            <p className="text-[var(--color-text)]">No orders found</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
                <div>
                  <h2 className="text-xl font-bold">Order #{selectedOrder.id}</h2>
                  <p className="text-sm text-[var(--color-text-light)]">
                    {format(new Date(selectedOrder.createdAt), 'MMMM dd, yyyy HH:mm')}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                    statusColors[selectedOrder.status]
                  }`}
                >
                  {selectedOrder.status.charAt(0).toUpperCase() +
                    selectedOrder.status.slice(1)}
                </span>
              </div>

              {/* Customer Info */}
              <div className="p-6 border-b border-[var(--color-border)]">
                <h3 className="font-semibold mb-4">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-[var(--color-text-light)]" />
                    <span>{selectedOrder.customer.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[var(--color-text-light)]" />
                    <span>{selectedOrder.customer.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[var(--color-text-light)]" />
                    <span>{selectedOrder.customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[var(--color-text-light)]" />
                    <span>
                      {selectedOrder.customer.city}, {selectedOrder.customer.country}
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-sm text-[var(--color-text-light)]">
                  {selectedOrder.customer.address}
                </p>
              </div>

              {/* Order Items */}
              <div className="p-6 border-b border-[var(--color-border)]">
                <h3 className="font-semibold mb-4">Order Items</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-[var(--color-text-light)]">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div className="p-6">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[var(--color-primary)]">
                    ${selectedOrder.total.toFixed(2)}
                  </span>
                </div>

                {/* Update Status */}
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">
                    Update Status
                  </label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) =>
                      handleStatusUpdate(
                        selectedOrder.id,
                        e.target.value as Order['status']
                      )
                    }
                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)]"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full mt-4 py-3 border border-[var(--color-border)] rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
