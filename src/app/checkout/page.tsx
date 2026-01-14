'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore, Order, CartItem } from '@/store/useStore';
import { 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  ChevronRight,
  MapPin,
  Phone,
  Check,
  Lock
} from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, clearCart, addOrder, currentUser } = useStore();
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  const [shipping, setShipping] = useState({
    firstName: currentUser?.name?.split(' ')[0] || '',
    lastName: currentUser?.name?.split(' ').slice(1).join(' ') || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [payment, setPayment] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [shippingMethod, setShippingMethod] = useState('standard');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = shippingMethod === 'express' ? 15.99 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const handleSubmitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate random order number
    const ordNum = 'TH' + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Create order object
    const newOrder: Order = {
      id: ordNum,
      items: cart as CartItem[],
      total: total,
      status: 'pending',
      customer: {
        name: `${shipping.firstName} ${shipping.lastName}`,
        email: shipping.email,
        phone: shipping.phone,
        address: shipping.address,
        city: `${shipping.city}, ${shipping.state} ${shipping.zipCode}`,
        country: shipping.country,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Add order to store
    addOrder(newOrder);
    
    setOrderNumber(ordNum);
    setOrderPlaced(true);
    clearCart();
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-4">Your cart is empty</h1>
          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              Continue Shopping
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto bg-white rounded-3xl shadow-lg p-8 text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">
            Order Confirmed!
          </h1>
          <p className="text-[var(--color-text-light)] mb-6">
            Thank you for your order. We've received your payment and will ship your items soon.
          </p>
          <div className="bg-[var(--color-background)] rounded-xl p-4 mb-6">
            <p className="text-sm text-[var(--color-text-light)]">Order Number</p>
            <p className="text-2xl font-bold text-[var(--color-primary)]">{orderNumber}</p>
          </div>
          <p className="text-sm text-[var(--color-text-light)] mb-6">
            A confirmation email has been sent to {shipping.email || 'your email'}
          </p>
          <div className="flex gap-4">
            <Link href="/products" className="flex-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-xl hover:bg-[var(--color-primary)]/10 transition-colors"
              >
                Continue Shopping
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8">
          <Link href="/cart" className="text-[var(--color-primary)] hover:underline">
            Cart
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className={step >= 1 ? 'text-[var(--color-primary)]' : 'text-gray-400'}>
            Shipping
          </span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className={step >= 2 ? 'text-[var(--color-primary)]' : 'text-gray-400'}>
            Payment
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step Indicator */}
            <div className="flex items-center gap-4 mb-8">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[var(--color-primary)]' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                  step >= 1 ? 'bg-[var(--color-primary)]' : 'bg-gray-300'
                }`}>
                  {step > 1 ? <Check className="w-5 h-5" /> : '1'}
                </div>
                <span className="font-medium">Shipping</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-200">
                <div 
                  className="h-full bg-[var(--color-primary)] transition-all"
                  style={{ width: step > 1 ? '100%' : '0%' }}
                />
              </div>
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[var(--color-primary)]' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                  step >= 2 ? 'bg-[var(--color-primary)]' : 'bg-gray-300'
                }`}>
                  2
                </div>
                <span className="font-medium">Payment</span>
              </div>
            </div>

            {/* Step 1: Shipping */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-[var(--color-text)] mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                  Shipping Information
                </h2>

                <form onSubmit={handleSubmitShipping} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={shipping.firstName}
                        onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={shipping.lastName}
                        onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={shipping.email}
                        onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={shipping.phone}
                        onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={shipping.address}
                      onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={shipping.city}
                        onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={shipping.state}
                        onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={shipping.zipCode}
                        onChange={(e) => setShipping({ ...shipping, zipCode: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Shipping Method */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-4">
                      Shipping Method
                    </label>
                    <div className="space-y-3">
                      <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${
                        shippingMethod === 'standard' ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-gray-200'
                      }`}>
                        <input
                          type="radio"
                          name="shipping"
                          value="standard"
                          checked={shippingMethod === 'standard'}
                          onChange={(e) => setShippingMethod(e.target.value)}
                          className="w-4 h-4 text-[var(--color-primary)]"
                        />
                        <Truck className="w-5 h-5 text-[var(--color-primary)]" />
                        <div className="flex-1">
                          <p className="font-medium text-[var(--color-text)]">Standard Shipping</p>
                          <p className="text-sm text-[var(--color-text-light)]">5-7 business days</p>
                        </div>
                        <span className="font-bold text-[var(--color-text)]">$5.99</span>
                      </label>

                      <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${
                        shippingMethod === 'express' ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-gray-200'
                      }`}>
                        <input
                          type="radio"
                          name="shipping"
                          value="express"
                          checked={shippingMethod === 'express'}
                          onChange={(e) => setShippingMethod(e.target.value)}
                          className="w-4 h-4 text-[var(--color-primary)]"
                        />
                        <Truck className="w-5 h-5 text-[var(--color-secondary)]" />
                        <div className="flex-1">
                          <p className="font-medium text-[var(--color-text)]">Express Shipping</p>
                          <p className="text-sm text-[var(--color-text-light)]">2-3 business days</p>
                        </div>
                        <span className="font-bold text-[var(--color-text)]">$15.99</span>
                      </label>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors"
                  >
                    Continue to Payment
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-[var(--color-text)] mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[var(--color-primary)]" />
                  Payment Information
                </h2>

                {/* Shipping Summary */}
                <div className="bg-[var(--color-background)] rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-[var(--color-text-light)]">Shipping to:</p>
                      <p className="font-medium text-[var(--color-text)]">
                        {shipping.firstName} {shipping.lastName}
                      </p>
                      <p className="text-sm text-[var(--color-text-light)]">
                        {shipping.address}, {shipping.city}, {shipping.state} {shipping.zipCode}
                      </p>
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      className="text-[var(--color-primary)] text-sm hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmitPayment} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Card Number *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        value={payment.cardNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
                          setPayment({ ...payment, cardNumber: value });
                        }}
                        className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                      />
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Name on Card *
                    </label>
                    <input
                      type="text"
                      required
                      value={payment.cardName}
                      onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                        value={payment.expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length > 2) {
                            value = value.slice(0, 2) + '/' + value.slice(2);
                          }
                          setPayment({ ...payment, expiryDate: value });
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="123"
                        maxLength={4}
                        value={payment.cvv}
                        onChange={(e) => setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                    <Lock className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-green-700">
                      Your payment information is encrypted and secure. We never store your card details.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <motion.button
                      type="button"
                      onClick={() => setStep(1)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-4 border border-gray-200 text-[var(--color-text)] font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-4 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-5 h-5" />
                      Place Order - ${total.toFixed(2)}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[var(--color-text)] mb-6">
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 max-h-64 overflow-y-auto mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-[var(--color-text)] text-sm line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-sm text-[var(--color-text-light)]">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-[var(--color-text)]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-[var(--color-text-light)]">
                  <span>Subtotal</span>
                  <span>৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[var(--color-text-light)]">
                  <span>Shipping</span>
                  <span>৳{shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[var(--color-text-light)]">
                  <span>Tax</span>
                  <span>৳{tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg text-[var(--color-text)]">
                  <span>Total</span>
                  <span className="text-[var(--color-primary)]">৳{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-center gap-4 text-[var(--color-text-light)]">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs">Secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    <span className="text-xs">Fast Delivery</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    <span className="text-xs">Guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
