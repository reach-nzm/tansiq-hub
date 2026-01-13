'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';

export default function PromoSection() {
  return (
    <section className="py-16 bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Promo - Big Sale */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] p-8 md:p-12 min-h-[300px]"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" viewBox="0 0 100 100">
                <pattern id="promo-pattern-1" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#promo-pattern-1)" />
              </svg>
            </div>

            <div className="relative z-10">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="inline-block px-4 py-1 bg-[var(--color-secondary)] text-[var(--color-primary-dark)] text-sm font-semibold rounded-full mb-4"
              >
                Limited Time Offer
              </motion.span>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold text-white mb-2"
              >
                Ramadan Sale
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl font-bold text-[var(--color-secondary)] mb-4"
              >
                30% OFF
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-white/80 mb-6 max-w-xs"
              >
                On all organic foods and Islamic books. Use code: BLESSED30
              </motion.p>

              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[var(--color-primary)] font-semibold rounded-lg hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary-dark)] transition-colors"
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>

            {/* Floating Decoration */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-20 -right-20 w-64 h-64 border-4 border-white/20 rounded-full"
            />
          </motion.div>

          {/* Right Promo - New Arrivals */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-secondary-light)] p-8 md:p-12 min-h-[300px]"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" viewBox="0 0 100 100">
                <pattern id="promo-pattern-2" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M10 0l10 10-10 10L0 10z" fill="currentColor" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#promo-pattern-2)" />
              </svg>
            </div>

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 mb-4"
              >
                <Clock className="w-5 h-5 text-[var(--color-primary-dark)]" />
                <span className="text-[var(--color-primary-dark)] font-medium">Just Arrived</span>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold text-[var(--color-primary-dark)] mb-2"
              >
                New Collection
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-[var(--color-primary)] mb-4"
              >
                Modest Spring Fashion
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-[var(--color-primary-dark)]/80 mb-6 max-w-xs"
              >
                Discover elegant new hijabs, abayas, and thobes for the spring season.
              </motion.p>

              <Link href="/products?category=Clothing">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
                >
                  Explore Collection
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>

            {/* Floating Decoration */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-20 -right-20 w-64 h-64 border-4 border-[var(--color-primary)]/20 rounded-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
