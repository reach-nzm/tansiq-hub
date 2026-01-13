'use client';

import { motion } from 'framer-motion';
import { Leaf, BookOpen, Heart, Award, Truck, Clock } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: 'Organic & Natural',
    description: 'All our food products are certified organic and sourced from trusted farms.',
  },
  {
    icon: BookOpen,
    title: 'Authentic Islamic Products',
    description: 'Carefully curated selection of Islamic books, art, and spiritual items.',
  },
  {
    icon: Heart,
    title: 'Modest Fashion',
    description: 'Beautiful and elegant modest clothing for the whole family.',
  },
  {
    icon: Award,
    title: 'Quality Guaranteed',
    description: 'Every product meets our high standards for quality and authenticity.',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Enjoy free shipping on all orders over $50 worldwide.',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Our customer service team is always here to help you.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-[var(--color-secondary)] font-medium tracking-wider uppercase text-sm">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mt-2 mb-4">
            The Tansiq Hub Difference
          </h2>
          <div className="arabesque-divider mx-auto" />
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="text-center p-8 rounded-2xl bg-[var(--color-background)] hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[var(--color-border)]"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-primary)]/10 rounded-2xl mb-6"
              >
                <feature.icon className="w-8 h-8 text-[var(--color-primary)]" />
              </motion.div>
              <h3 className="text-xl font-bold text-[var(--color-text)] mb-3">
                {feature.title}
              </h3>
              <p className="text-[var(--color-text-light)]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
