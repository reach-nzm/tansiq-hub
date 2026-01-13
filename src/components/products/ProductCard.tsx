'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { Product, useStore } from '@/store/useStore';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 card-hover"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="px-3 py-1 bg-[var(--color-primary)] text-white text-xs font-semibold rounded-full">
              NEW
            </span>
          )}
          {product.isBestseller && (
            <span className="px-3 py-1 bg-[var(--color-secondary)] text-[var(--color-primary-dark)] text-xs font-semibold rounded-full">
              BESTSELLER
            </span>
          )}
          {product.originalPrice && (
            <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
              SALE
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-colors"
          >
            <Heart className="w-5 h-5" />
          </motion.button>
          <Link href={`/products/${product.id}`}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-colors"
            >
              <Eye className="w-5 h-5" />
            </motion.div>
          </Link>
        </div>

        {/* Add to Cart Button */}
        <motion.button
          initial={{ y: 100 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => addToCart(product)}
          className="absolute bottom-0 left-0 right-0 py-3 bg-[var(--color-primary)] text-white font-semibold flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-[var(--color-text-light)] uppercase tracking-wider mb-1">
          {product.category}
        </p>

        {/* Title */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-[var(--color-text)] line-clamp-2 hover:text-[var(--color-primary)] transition-colors mb-1">
            {product.name}
          </h3>
        </Link>

        {/* Arabic Name */}
        {product.nameArabic && (
          <p className="text-sm text-[var(--color-text-light)] mb-2">{product.nameArabic}</p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-[var(--color-secondary)] fill-[var(--color-secondary)]'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-[var(--color-text-light)]">
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-[var(--color-primary)]">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-[var(--color-text-light)] line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
