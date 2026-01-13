'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    name: 'Organic Foods',
    description: 'Fresh & Natural',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop',
    href: '/products?category=Organic+Foods',
    count: 24,
    bgColor: 'bg-green-50',
  },
  {
    name: 'Books',
    description: 'Knowledge & Wisdom',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=400&fit=crop',
    href: '/products?category=Books',
    count: 18,
    bgColor: 'bg-blue-50',
  },
  {
    name: 'Clothing',
    description: 'Modest Fashion',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop',
    href: '/products?category=Clothing',
    count: 32,
    bgColor: 'bg-purple-50',
  },
  {
    name: 'Home & Decor',
    description: 'Beautiful Living',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
    href: '/products?category=Home+%26+Decor',
    count: 15,
    bgColor: 'bg-orange-50',
  },
  {
    name: 'Health & Beauty',
    description: 'Self Care',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
    href: '/products?category=Health+%26+Beauty',
    count: 21,
    bgColor: 'bg-pink-50',
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 
            className="text-3xl lg:text-4xl font-bold text-[var(--color-text)] mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Shop by Category
          </h2>
          <p className="text-[var(--color-text-muted)]">Find exactly what you&apos;re looking for</p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={category.href} className="block group">
                <div className={`${category.bgColor} rounded-3xl p-4 lg:p-6 transition-all duration-300 hover:shadow-soft-lg`}>
                  {/* Image */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-white">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="text-center">
                    <h3 className="font-semibold text-[var(--color-text)] mb-1 group-hover:text-[var(--color-secondary)] transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {category.count} products
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
