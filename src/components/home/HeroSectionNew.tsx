'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-bg-cream)] via-white to-[var(--color-bg-peach)]">
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Main Hero Content - Left Side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center order-2 lg:order-1"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-[var(--color-bg-lavender)] w-fit px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">New Collection 2026</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--color-text)] leading-tight mb-6"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Discover
              <span className="block text-[var(--color-secondary)]">Quality Products</span>
              For Your Lifestyle
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-[var(--color-text-muted)] mb-8 max-w-md"
            >
              Explore our curated collection of premium organic foods, books, clothing, and home decor. Quality you can trust.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary group"
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link href="/products?category=new">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3.5 rounded-full font-semibold border-2 border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all"
                >
                  New Arrivals
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center gap-6 mt-10 pt-8 border-t border-[var(--color-border-light)]"
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-text)] text-sm">Free Shipping</p>
                  <p className="text-xs text-[var(--color-text-muted)]">On orders ৳5000+</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-text)] text-sm">Secure Payment</p>
                  <p className="text-xs text-[var(--color-text-muted)]">100% Protected</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-text)] text-sm">Easy Returns</p>
                  <p className="text-xs text-[var(--color-text-muted)]">30 Day Policy</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image Grid - Right Side */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative order-1 lg:order-2"
          >
            {/* Main Image */}
            <div className="relative">
              <div className="aspect-[4/5] lg:aspect-square rounded-3xl overflow-hidden bg-[var(--color-bg-beige)]">
                <Image
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1000&fit=crop"
                  alt="Featured products"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating Sticker Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: -12 }}
                transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                className="absolute -top-4 -right-4 lg:top-8 lg:-right-8 z-10"
              >
                <div className="w-24 h-24 lg:w-28 lg:h-28 bg-[var(--color-orange)] rounded-full flex flex-col items-center justify-center text-white shadow-lg transform rotate-12">
                  <span className="text-2xl lg:text-3xl font-bold">30%</span>
                  <span className="text-xs lg:text-sm font-semibold">OFF</span>
                </div>
              </motion.div>

              {/* Floating Product Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-6 left-6 right-6 lg:bottom-8 lg:left-8 lg:right-auto lg:w-64"
              >
                <div className="bg-white rounded-2xl p-4 shadow-soft-lg flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[var(--color-bg-cream)] shrink-0">
                    <Image
                      src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop"
                      alt="Product"
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[var(--color-text-muted)] mb-1">Best Seller</p>
                    <p className="font-semibold text-[var(--color-text)] truncate text-sm">Premium Organic</p>
                    <p className="text-[var(--color-secondary)] font-bold">৳4,999</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="hidden lg:block absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-[var(--color-secondary)]/20 rounded-full blur-3xl" />
            <div className="hidden lg:block absolute -z-10 -top-10 -right-10 w-32 h-32 bg-[var(--color-bg-lavender)] rounded-full blur-2xl" />
          </motion.div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-[var(--color-secondary)] rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-[var(--color-bg-lavender)] rounded-full" />
        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-green-400 rounded-full" />
      </div>
    </section>
  );
}
