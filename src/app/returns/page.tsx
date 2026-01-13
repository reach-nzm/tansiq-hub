'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { RefreshCcw, Package, Clock, CheckCircle, AlertCircle, ArrowLeft, Mail, Phone } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <RefreshCcw className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Returns & Refunds</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Your satisfaction is our priority. Learn about our hassle-free return policy.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Return Process */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-8 text-center">
            How to Return an Item
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: Package,
                step: '1',
                title: 'Initiate Return',
                description: 'Log in to your account and go to Order History to start a return request',
              },
              {
                icon: CheckCircle,
                step: '2',
                title: 'Get Approval',
                description: 'We will review your request and send you a return shipping label',
              },
              {
                icon: RefreshCcw,
                step: '3',
                title: 'Ship Item',
                description: 'Pack the item securely and drop it off at any shipping location',
              },
              {
                icon: Clock,
                step: '4',
                title: 'Get Refund',
                description: 'Receive your refund within 5-7 business days after we receive the item',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="text-center"
              >
                <div className="relative mb-4">
                  <div className="w-16 h-16 mx-auto bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-[var(--color-primary)]" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--color-secondary)] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-semibold text-[var(--color-text)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--color-text-light)]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Return Policy */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6">Return Policy</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-[var(--color-text)] mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Eligible for Return
              </h3>
              <ul className="text-[var(--color-text-light)] space-y-2 ml-7">
                <li>• Items returned within 30 days of delivery</li>
                <li>• Unused and in original packaging</li>
                <li>• Items with all tags and labels attached</li>
                <li>• Books in new, unread condition</li>
                <li>• Clothing items that haven&apos;t been worn or washed</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-[var(--color-text)] mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Not Eligible for Return
              </h3>
              <ul className="text-[var(--color-text-light)] space-y-2 ml-7">
                <li>• Food items (dates, honey, oils, etc.)</li>
                <li>• Personal care items (miswak, oils, etc.)</li>
                <li>• Items marked as &quot;Final Sale&quot;</li>
                <li>• Custom or personalized items</li>
                <li>• Items damaged by misuse</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-[var(--color-text)] mb-2 flex items-center gap-2">
                <RefreshCcw className="w-5 h-5 text-[var(--color-primary)]" />
                Exchange Policy
              </h3>
              <p className="text-[var(--color-text-light)] ml-7">
                We offer free exchanges for items of equal or lesser value. For items of greater value, 
                you&apos;ll be charged the difference. Exchanges must be requested within 30 days of delivery.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Refund Information */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 rounded-2xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6">Refund Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-semibold text-[var(--color-text)] mb-4">Refund Timeline</h3>
              <ul className="space-y-3 text-[var(--color-text-light)]">
                <li className="flex justify-between">
                  <span>Return received:</span>
                  <span className="font-medium">1-2 business days</span>
                </li>
                <li className="flex justify-between">
                  <span>Quality inspection:</span>
                  <span className="font-medium">1-3 business days</span>
                </li>
                <li className="flex justify-between">
                  <span>Refund processed:</span>
                  <span className="font-medium">1-2 business days</span>
                </li>
                <li className="flex justify-between border-t pt-3 mt-3">
                  <span className="font-semibold text-[var(--color-text)]">Total:</span>
                  <span className="font-semibold text-[var(--color-primary)]">5-7 business days</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="font-semibold text-[var(--color-text)] mb-4">Refund Methods</h3>
              <ul className="space-y-3 text-[var(--color-text-light)]">
                <li>
                  <span className="font-medium text-[var(--color-text)]">Original Payment Method</span>
                  <p className="text-sm">Refund will be credited to your original payment method</p>
                </li>
                <li>
                  <span className="font-medium text-[var(--color-text)]">Store Credit</span>
                  <p className="text-sm">Opt for instant store credit with 10% bonus</p>
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Contact Support */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4">Need Help?</h2>
          <p className="text-[var(--color-text-light)] mb-6">
            Our customer support team is here to assist you with any return or refund questions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              <Mail className="w-5 h-5" />
              Contact Support
            </Link>
            <a
              href="tel:+18001234567"
              className="inline-flex items-center gap-2 bg-white text-[var(--color-text)] px-6 py-3 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors"
            >
              <Phone className="w-5 h-5" />
              1-800-123-4567
            </a>
          </div>
        </motion.section>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
