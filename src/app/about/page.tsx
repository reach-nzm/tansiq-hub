'use client';

import { motion } from 'framer-motion';
import { Heart, Award, Users, Globe, Leaf, BookOpen, Shield } from 'lucide-react';
import Link from 'next/link';

const values = [
  {
    icon: Heart,
    title: 'Barakah First',
    description: 'We believe in bringing blessings to every product we offer and every interaction we have.',
  },
  {
    icon: Award,
    title: 'Quality Guaranteed',
    description: 'Every product is carefully selected to meet our high standards of quality and authenticity.',
  },
  {
    icon: Leaf,
    title: 'Natural & Organic',
    description: 'We prioritize organic, natural, and halal products for a healthier lifestyle.',
  },
  {
    icon: Globe,
    title: 'Global Community',
    description: 'Serving Muslims and conscious consumers worldwide with care and dedication.',
  },
];

const stats = [
  { value: '10K+', label: 'Happy Customers' },
  { value: '500+', label: 'Quality Products' },
  { value: '50+', label: 'Countries Served' },
  { value: '4.9', label: 'Average Rating' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <section className="relative bg-[var(--color-primary)] py-20 overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-10" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Tansiq Hub</h1>
            <p className="text-xl text-white/80 mb-2">عن تنسيق هب</p>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Your trusted destination for blessed products that bring quality and barakah to your everyday life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[var(--color-secondary)] font-medium uppercase tracking-wider text-sm">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mt-2 mb-6">
                Building Bridges Through Blessed Products
              </h2>
              <p className="text-[var(--color-text-light)] mb-4 leading-relaxed">
                Tansiq Hub was founded with a simple yet powerful mission: to make quality Islamic products and organic goods accessible to Muslims and conscious consumers worldwide.
              </p>
              <p className="text-[var(--color-text-light)] mb-4 leading-relaxed">
                The name "Tansiq" (تنسيق) means "coordination" or "harmony" in Arabic. We believe in creating harmony between modern convenience and traditional values, between quality and affordability, between commerce and community.
              </p>
              <p className="text-[var(--color-text-light)] leading-relaxed">
                Every product in our store is carefully selected to ensure it meets our standards for quality, authenticity, and alignment with Islamic values. We work directly with artisans, farmers, and publishers who share our commitment to excellence.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img
                    src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400"
                    alt="Islamic books"
                    className="w-full rounded-2xl shadow-lg"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?w=400"
                    alt="Organic dates"
                    className="w-full rounded-2xl shadow-lg"
                  />
                </div>
                <div className="space-y-4 pt-8">
                  <img
                    src="https://images.unsplash.com/photo-1590073242678-70ee3fc28f8e?w=400"
                    alt="Hijab collection"
                    className="w-full rounded-2xl shadow-lg"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=400"
                    alt="Islamic art"
                    className="w-full rounded-2xl shadow-lg"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[var(--color-secondary)] font-medium uppercase tracking-wider text-sm">
              What We Believe
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mt-2 mb-4">
              Our Core Values
            </h2>
            <div className="arabesque-divider mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-[var(--color-background)] hover:shadow-xl transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-primary)]/10 rounded-2xl mb-4">
                  <value.icon className="w-8 h-8 text-[var(--color-primary)]" />
                </div>
                <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">
                  {value.title}
                </h3>
                <p className="text-[var(--color-text-light)]">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[var(--color-primary)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center text-white"
              >
                <p className="text-4xl md:text-5xl font-bold text-[var(--color-secondary)]">
                  {stat.value}
                </p>
                <p className="mt-2 text-white/80">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[var(--color-secondary)] rounded-3xl p-12 text-center"
          >
            <h2 className="text-3xl font-bold text-[var(--color-primary-dark)] mb-4">
              Ready to Explore?
            </h2>
            <p className="text-[var(--color-primary-dark)]/80 mb-8 max-w-2xl mx-auto">
              Discover our carefully curated collection of organic foods, Islamic books, modest fashion, and more.
            </p>
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                Shop Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
