'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    name: 'Organic Foods',
    nameArabic: 'أطعمة عضوية',
    description: 'Pure, natural, and halal products',
    image: 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?w=400&auto=format&fit=crop',
    href: '/products?category=Organic+Foods',
    color: 'from-green-600 to-green-800',
    items: 150,
  },
  {
    name: 'Islamic Books',
    nameArabic: 'كتب إسلامية',
    description: 'Quran, Hadith, and Islamic literature',
    image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&auto=format&fit=crop',
    href: '/products?category=Books',
    color: 'from-amber-600 to-amber-800',
    items: 200,
  },
  {
    name: 'Modest Clothing',
    nameArabic: 'ملابس محتشمة',
    description: 'Elegant hijabs, abayas, and thobes',
    image: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=400&auto=format&fit=crop',
    href: '/products?category=Clothing',
    color: 'from-teal-600 to-teal-800',
    items: 300,
  },
  {
    name: 'Home & Decor',
    nameArabic: 'ديكور المنزل',
    description: 'Islamic art and prayer essentials',
    image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=400&auto=format&fit=crop',
    href: '/products?category=Home+%26+Decor',
    color: 'from-purple-600 to-purple-800',
    items: 120,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function CategoriesSection() {
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
            Browse by Category
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mt-2 mb-4">
            Shop Our Collections
          </h2>
          <div className="arabesque-divider mx-auto" />
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((category) => (
            <motion.div key={category.name} variants={itemVariants}>
              <Link href={category.href}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="group relative h-80 rounded-2xl overflow-hidden shadow-lg cursor-pointer"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-70 group-hover:opacity-80 transition-opacity duration-300`} />
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                    <motion.div
                      initial={{ y: 20 }}
                      whileHover={{ y: 0 }}
                    >
                      <span className="text-white/80 text-sm">{category.items}+ Products</span>
                      <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                      <p className="text-lg opacity-80 mb-1">{category.nameArabic}</p>
                      <p className="text-sm opacity-70 mb-4">{category.description}</p>
                      
                      <div className="flex items-center gap-2 text-[var(--color-secondary)] font-medium group-hover:gap-4 transition-all">
                        <span>Explore</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Decorative Corner */}
                  <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white/30 rounded-full flex items-center justify-center">
                    <div className="w-10 h-10 border border-white/50 rounded-full" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
