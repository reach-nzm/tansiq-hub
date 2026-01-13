'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

interface BannerProps {
  title: string;
  subtitle?: string;
  image: string;
  href: string;
  bgColor?: string;
  textColor?: string;
  badge?: string;
  size?: 'small' | 'medium' | 'large';
}

function BannerCard({ title, subtitle, image, href, bgColor = 'var(--color-bg-cream)', textColor = 'var(--color-text)', badge, size = 'medium' }: BannerProps) {
  return (
    <Link href={href} className="block h-full">
      <motion.div
        whileHover={{ scale: 0.99 }}
        className={`relative h-full rounded-3xl overflow-hidden group cursor-pointer`}
        style={{ backgroundColor: bgColor }}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-6 lg:p-8">
          {badge && (
            <span className="inline-block w-fit px-3 py-1.5 bg-[var(--color-secondary)] text-[var(--color-primary)] text-xs font-bold rounded-full mb-3">
              {badge}
            </span>
          )}
          
          <h3 
            className={`font-bold text-white mb-2 ${size === 'large' ? 'text-2xl lg:text-3xl' : 'text-xl lg:text-2xl'}`}
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {title}
          </h3>
          
          {subtitle && (
            <p className="text-white/80 text-sm mb-4">{subtitle}</p>
          )}

          {/* CTA Button */}
          <div className="flex items-center gap-2 mt-auto">
            <span className="w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:bg-[var(--color-secondary)] transition-colors">
              <ArrowUpRight className="w-5 h-5 text-[var(--color-primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function PromoBanner() {
  return (
    <section className="py-12 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <h2 
              className="text-3xl lg:text-4xl font-bold text-[var(--color-text)] mb-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Shop by Category
            </h2>
            <p className="text-[var(--color-text-muted)]">Explore our curated collections</p>
          </div>
          <Link 
            href="/products"
            className="inline-flex items-center gap-2 text-[var(--color-text)] font-medium hover:text-[var(--color-secondary)] transition-colors"
          >
            View All Categories
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Large Banner - Spans 2 rows */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:row-span-2 h-64 md:h-80 lg:h-auto"
          >
            <BannerCard
              title="Organic Collection"
              subtitle="Fresh, natural products for healthy living"
              image="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=800&fit=crop"
              href="/products?category=Organic+Foods"
              badge="UP TO 40% OFF"
              size="large"
            />
          </motion.div>

          {/* Top Right Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="h-64 md:h-48 lg:h-auto"
          >
            <BannerCard
              title="Books & Literature"
              subtitle="Expand your knowledge"
              image="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&h=400&fit=crop"
              href="/products?category=Books"
              badge="NEW ARRIVALS"
            />
          </motion.div>

          {/* Top Far Right Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="h-64 md:h-48 lg:h-auto"
          >
            <BannerCard
              title="Home & Decor"
              subtitle="Transform your space"
              image="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop"
              href="/products?category=Home+%26+Decor"
            />
          </motion.div>

          {/* Bottom Right Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="h-64 md:h-48 lg:h-auto lg:col-span-2"
          >
            <Link href="/products?category=Clothing" className="block h-full">
              <motion.div
                whileHover={{ scale: 0.99 }}
                className="relative h-full rounded-3xl overflow-hidden group cursor-pointer bg-[var(--color-bg-lavender)]"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=400&fit=crop"
                    alt="Fashion Collection"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative h-full flex items-center p-6 lg:p-8">
                  <div className="max-w-md">
                    <span className="inline-block w-fit px-3 py-1.5 bg-[var(--color-secondary)] text-[var(--color-primary)] text-xs font-bold rounded-full mb-3">
                      TRENDING NOW
                    </span>
                    <h3 
                      className="text-2xl lg:text-3xl font-bold text-white mb-2"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      Modest Fashion Collection
                    </h3>
                    <p className="text-white/80 text-sm mb-4">
                      Elegant styles for every occasion
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:bg-[var(--color-secondary)] transition-colors">
                        <ArrowUpRight className="w-5 h-5 text-[var(--color-primary)]" />
                      </span>
                      <span className="text-white font-medium">Shop Now</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
