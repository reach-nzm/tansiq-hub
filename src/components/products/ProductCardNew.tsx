'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Eye, Plus, Check } from 'lucide-react';
import { Product, useStore } from '@/store/useStore';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  index?: number;
  variant?: 'default' | 'compact' | 'horizontal';
}

export default function ProductCard({ product, index = 0, variant = 'default' }: ProductCardProps) {
  const { addToCart, cart } = useStore();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isInCart = cart.some(item => item.id === product.id);
  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  const handleAddToCart = () => {
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  if (variant === 'horizontal') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="flex gap-3 p-2 rounded-xl hover:bg-[var(--color-bg-cream)] transition-colors group"
      >
        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[var(--color-bg-cream)] shrink-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[var(--color-text-muted)] mb-0.5">{product.category}</p>
          <Link href={`/products/${product.id}`}>
            <h4 className="font-medium text-sm text-[var(--color-text)] truncate hover:text-[var(--color-secondary)] transition-colors">
              {product.name}
            </h4>
          </Link>
          <p className="text-sm font-semibold text-[var(--color-secondary)]">${product.price.toFixed(2)}</p>
        </div>
      </motion.div>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group"
      >
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-[var(--color-bg-cream)] mb-3">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full shadow-soft flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <Link href={`/products/${product.id}`}>
          <h4 className="font-medium text-[var(--color-text)] hover:text-[var(--color-secondary)] transition-colors line-clamp-1">
            {product.name}
          </h4>
        </Link>
        <p className="text-[var(--color-secondary)] font-semibold">${product.price.toFixed(2)}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="group bg-white rounded-3xl overflow-hidden border border-[var(--color-border-light)] hover:border-[var(--color-border)] hover:shadow-soft-lg transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[var(--color-bg-cream)]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNew && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1.5 bg-[var(--color-primary)] text-white text-xs font-semibold rounded-full"
            >
              NEW
            </motion.span>
          )}
          {product.isBestseller && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="px-3 py-1.5 bg-[var(--color-bg-lavender)] text-[var(--color-primary)] text-xs font-semibold rounded-full"
            >
              BEST SELLER
            </motion.span>
          )}
          {discount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15 }}
              className="px-3 py-1.5 bg-[var(--color-orange)] text-white text-xs font-semibold rounded-full"
            >
              -{discount}%
            </motion.span>
          )}
        </div>

        {/* Quick Actions - Show on Hover */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`w-10 h-10 rounded-full shadow-soft flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 ${
              isWishlisted 
                ? 'bg-red-500 text-white' 
                : 'bg-white hover:bg-red-50 text-[var(--color-text)]'
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </motion.button>
          <Link href={`/products/${product.id}`}>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-white rounded-full shadow-soft flex items-center justify-center hover:bg-[var(--color-bg-cream)] transition-colors opacity-0 group-hover:opacity-100"
            >
              <Eye className="w-5 h-5 text-[var(--color-text)]" />
            </motion.div>
          </Link>
        </div>

        {/* Add to Cart Button - Slide up on Hover */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
        >
          <button
            onClick={handleAddToCart}
            disabled={justAdded}
            className={`w-full py-3.5 rounded-full font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
              justAdded || isInCart
                ? 'bg-green-500 text-white'
                : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)]'
            }`}
          >
            {justAdded || isInCart ? (
              <>
                <Check className="w-5 h-5" />
                {justAdded ? 'Added!' : 'In Cart'}
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </>
            )}
          </button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <p className="text-xs text-[var(--color-text-light)] uppercase tracking-wider mb-2">
          {product.category}
        </p>

        {/* Title */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-[var(--color-text)] line-clamp-2 hover:text-[var(--color-secondary)] transition-colors mb-3 min-h-[48px]" style={{ fontFamily: 'var(--font-heading)' }}>
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-[var(--color-secondary)]'
                    : 'text-[var(--color-border)]'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-[var(--color-text-muted)]">
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-[var(--color-secondary)]">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-[var(--color-text-light)] line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          {/* Quick Add Button - Always visible */}
          <button
            onClick={handleAddToCart}
            className="w-10 h-10 bg-[var(--color-bg-cream)] hover:bg-[var(--color-primary)] hover:text-white rounded-full flex items-center justify-center transition-colors md:hidden"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
