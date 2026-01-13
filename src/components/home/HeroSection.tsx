'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Star, Truck, Shield, Headphones } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden islamic-pattern">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-background)] via-transparent to-[var(--color-primary)]/5" />
        
        {/* Animated Circles */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-[var(--color-primary)] rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-[var(--color-secondary)] rounded-full blur-3xl"
        />

        {/* Decorative Stars */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
            className="absolute"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
            }}
          >
            <Star className="w-4 h-4 text-[var(--color-secondary)] fill-[var(--color-secondary)]" />
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)]/10 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-[var(--color-secondary)]" />
              <span className="text-sm font-medium text-[var(--color-primary)]">
                Blessed Collection 2026
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-text)] mb-4 leading-tight"
            >
              Discover{' '}
              <span className="text-gradient">Blessed</span>
              <br />
              Products for{' '}
              <span className="text-[var(--color-primary)]">Your Life</span>
            </motion.h1>

            {/* Arabic Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl text-[var(--color-secondary)] mb-4 font-medium"
              style={{ fontFamily: 'serif' }}
            >
              بَرَكَةٌ فِي كُلِّ مَنْتَج
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-[var(--color-text-light)] mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Your trusted destination for premium organic foods, inspiring Islamic books, 
              elegant modest fashion, and beautiful home decor. Experience quality with barakah.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary flex items-center gap-2 justify-center"
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/products?featured=true">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary flex items-center gap-2 justify-center"
                >
                  Featured Items
                  <Sparkles className="w-5 h-5" />
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap justify-center lg:justify-start gap-6 mt-10"
            >
              <div className="flex items-center gap-2 text-[var(--color-text-light)]">
                <Truck className="w-5 h-5 text-[var(--color-primary)]" />
                <span className="text-sm">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--color-text-light)]">
                <Shield className="w-5 h-5 text-[var(--color-primary)]" />
                <span className="text-sm">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--color-text-light)]">
                <Headphones className="w-5 h-5 text-[var(--color-primary)]" />
                <span className="text-sm">24/7 Support</span>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Featured Products Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main Product Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="bg-white rounded-3xl shadow-2xl p-6 relative z-20"
              >
                <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?w=500"
                    alt="Featured Product"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm text-[var(--color-text-light)] mb-1">Featured Product</p>
                  <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">Premium Medjool Dates</h3>
                  <p className="text-2xl font-bold text-[var(--color-primary)]">$24.99</p>
                </div>
              </motion.div>

              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, 10, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -top-8 -left-8 bg-white rounded-2xl shadow-xl p-4 z-10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=100"
                      alt="Book"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-light)]">Islamic Books</p>
                    <p className="font-semibold text-sm">500+ Items</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, -2, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -right-4 bg-[var(--color-secondary)] rounded-2xl shadow-xl p-4 z-30"
              >
                <div className="text-center text-[var(--color-primary-dark)]">
                  <p className="text-3xl font-bold">20%</p>
                  <p className="text-sm font-medium">Off Today</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                className="absolute top-1/2 -right-12 bg-white rounded-2xl shadow-xl p-4 z-10"
              >
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[var(--color-secondary)] fill-[var(--color-secondary)]" />
                    ))}
                  </div>
                  <span className="text-sm font-medium">4.9</span>
                </div>
                <p className="text-xs text-[var(--color-text-light)] mt-1">2,000+ Reviews</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
