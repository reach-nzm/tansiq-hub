'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight,
  Tag,
  Truck
} from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useStore();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax - discount;

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'BLESSED30') {
      setDiscount(subtotal * 0.3);
    } else if (promoCode.toUpperCase() === 'TANSIQ10') {
      setDiscount(subtotal * 0.1);
    } else {
      alert('Invalid promo code');
    }
  };

  if (cart.length === 0) {
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
            Your Cart is Empty
          </h1>
          <p className="text-[var(--color-text-light)] mb-6">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary inline-flex items-center gap-2"
            >
              Start Shopping
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
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
            <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
            <p className="text-white/80">سلة التسوق</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
                <h2 className="text-xl font-bold">
                  Cart Items ({cart.length})
                </h2>
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-600 text-sm font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* Items */}
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-6 border-b border-[var(--color-border)] last:border-0"
                  >
                    <div className="flex gap-6">
                      {/* Image */}
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <Link href={`/products/${item.id}`}>
                          <h3 className="font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-[var(--color-text-light)] mb-2">
                          {item.category}
                        </p>
                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-[var(--color-border)] rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-[var(--color-background)] transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-[var(--color-background)] transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price & Remove */}
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-[var(--color-primary)]">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Continue Shopping */}
            <Link href="/products">
              <motion.button
                whileHover={{ x: -5 }}
                className="mt-6 text-[var(--color-primary)] font-medium flex items-center gap-2"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                Continue Shopping
              </motion.button>
            </Link>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="text-sm font-medium text-[var(--color-text)] mb-2 block">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-light)]" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="w-full pl-10 pr-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                  <button
                    onClick={applyPromoCode}
                    className="px-4 py-3 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-xs text-[var(--color-text-light)] mt-2">
                  Try: BLESSED30 or TANSIQ10
                </p>
              </div>

              {/* Summary Details */}
              <div className="space-y-4 border-b border-[var(--color-border)] pb-6 mb-6">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-light)]">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-light)] flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    Shipping
                  </span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-light)]">Tax (8%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-${discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-[var(--color-primary)]">
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* Free Shipping Progress */}
              {subtotal < 50 && (
                <div className="mb-6 p-4 bg-[var(--color-background)] rounded-lg">
                  <p className="text-sm text-[var(--color-text-light)] mb-2">
                    Add ${(50 - subtotal).toFixed(2)} more for FREE shipping!
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[var(--color-primary)] h-2 rounded-full transition-all"
                      style={{ width: `${(subtotal / 50) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <Link href="/checkout">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>

              {/* Security Badge */}
              <div className="mt-6 text-center">
                <p className="text-xs text-[var(--color-text-light)]">
                  🔒 Secure checkout powered by SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
