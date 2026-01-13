'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { useStore } from '@/store/useStore';

export default function FeaturedProducts() {
  const { products } = useStore();
  const featuredProducts = products.filter(p => p.featured).slice(0, 4);

  return (
    <section className="py-20 bg-[var(--color-background)] islamic-pattern">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-[var(--color-secondary)] font-medium tracking-wider uppercase text-sm">
            Handpicked for You
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mt-2 mb-4">
            Featured Products
          </h2>
          <p className="text-[var(--color-text-light)] max-w-2xl mx-auto">
            Discover our carefully curated selection of premium products, chosen for their quality and value.
          </p>
          <div className="arabesque-divider mx-auto mt-4" />
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg font-semibold hover:bg-[var(--color-primary)] hover:text-white transition-colors"
            >
              View All Products
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
