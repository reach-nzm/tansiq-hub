'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Trash2, 
  ShoppingCart, 
  ArrowRight,
  Star
} from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-[var(--color-primary)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
            Your Wishlist is Empty
          </h1>
          <p className="text-[var(--color-text-light)] mb-6">
            Save your favorite items to your wishlist
          </p>
          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary inline-flex items-center gap-2"
            >
              Browse Products
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const handleAddToCart = (product: typeof wishlist[0]) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <div className="bg-[var(--color-primary)] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl font-bold mb-2">My Wishlist</h1>
            <p className="text-white/80">قائمة المفضلة</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Wishlist Header */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-[var(--color-text-light)]">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
          </p>
          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="text-[var(--color-primary)] font-medium hover:underline"
            >
              Continue Shopping
            </motion.button>
          </Link>
        </div>

        {/* Wishlist Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {wishlist.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden group"
              >
                {/* Image */}
                <div className="relative aspect-square">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {item.isNew && (
                      <span className="px-2 py-1 bg-[var(--color-primary)] text-white text-xs font-semibold rounded-full">
                        NEW
                      </span>
                    )}
                    {item.originalPrice && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                        {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>

                  {/* Remove Button */}
                  <motion.button
                    onClick={() => removeFromWishlist(item.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </motion.button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-xs text-[var(--color-primary)] font-medium mb-1">
                    {item.category}
                  </p>
                  <Link href={`/products/${item.id}`}>
                    <h3 className="font-semibold text-[var(--color-text)] mb-2 line-clamp-2 hover:text-[var(--color-primary)] transition-colors">
                      {item.name}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium text-[var(--color-text)]">
                      {item.rating}
                    </span>
                    <span className="text-xs text-[var(--color-text-light)]">
                      ({item.reviews} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-[var(--color-primary)]">
                        ${item.price.toFixed(2)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-sm text-[var(--color-text-light)] line-through">
                          ${item.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <motion.button
                    onClick={() => handleAddToCart(item)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
