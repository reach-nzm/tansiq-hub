'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/products/ProductCardNew';
import { useStore } from '@/store/useStore';

export default function FeaturedProducts() {
  const { products } = useStore();
  const featuredProducts = products.filter(p => p.featured).slice(0, 8);

  return (
    <section className="py-12 lg:py-20 bg-[var(--color-bg-cream)]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <span className="inline-block px-4 py-1.5 bg-[var(--color-secondary)]/20 text-[var(--color-secondary)] text-sm font-semibold rounded-full mb-4">
              Featured Products
            </span>
            <h2 
              className="text-3xl lg:text-4xl font-bold text-[var(--color-text)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Best Sellers This Week
            </h2>
          </div>
          <Link 
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full text-[var(--color-text)] font-medium hover:bg-[var(--color-primary)] hover:text-white transition-colors shadow-soft"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              index={index}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-[var(--color-text-muted)] mb-4">
            Can&apos;t find what you&apos;re looking for?
          </p>
          <Link 
            href="/contact"
            className="inline-flex items-center gap-2 text-[var(--color-text)] font-medium hover:text-[var(--color-secondary)] transition-colors underline underline-offset-4"
          >
            Contact us for custom orders
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
