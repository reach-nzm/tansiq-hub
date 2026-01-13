'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  Minus, 
  Plus, 
  Truck, 
  Shield, 
  RefreshCw,
  ChevronRight,
  Check
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import ProductCard from '@/components/products/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const { products, addToCart } = useStore();
  const product = products.find((p) => p.id === params.id);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link href="/products" className="btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images || [product.image];
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-light)]">
            <Link href="/" className="hover:text-[var(--color-primary)]">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/products" className="hover:text-[var(--color-primary)]">Products</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/products?category=${product.category}`} className="hover:text-[var(--color-primary)]">
              {product.category}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[var(--color-text)]">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-lg mb-4">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="px-3 py-1 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-full">
                    NEW
                  </span>
                )}
                {product.isBestseller && (
                  <span className="px-3 py-1 bg-[var(--color-secondary)] text-[var(--color-primary-dark)] text-sm font-semibold rounded-full">
                    BESTSELLER
                  </span>
                )}
                {product.originalPrice && (
                  <span className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex gap-4">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-[var(--color-primary)]'
                        : 'border-transparent'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Category */}
            <p className="text-[var(--color-secondary)] font-medium uppercase tracking-wider text-sm mb-2">
              {product.category}
            </p>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-2">
              {product.name}
            </h1>

            {/* Arabic Name */}
            {product.nameArabic && (
              <p className="text-xl text-[var(--color-text-light)] mb-4">{product.nameArabic}</p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-[var(--color-secondary)] fill-[var(--color-secondary)]'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[var(--color-text-light)]">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-[var(--color-primary)]">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-[var(--color-text-light)] line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-[var(--color-text-light)] leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-3 h-3 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} />
              <span className={product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}>
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-6 mb-8">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border border-[var(--color-border)] rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-[var(--color-background)] transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 hover:bg-[var(--color-background)] transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
                  isAddedToCart
                    ? 'bg-green-500 text-white'
                    : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isAddedToCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 border border-[var(--color-border)] rounded-xl hover:bg-[var(--color-background)] transition-colors"
              >
                <Heart className="w-6 h-6" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 border border-[var(--color-border)] rounded-xl hover:bg-[var(--color-background)] transition-colors"
              >
                <Share2 className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-[var(--color-background)] rounded-2xl">
              <div className="text-center">
                <Truck className="w-8 h-8 mx-auto mb-2 text-[var(--color-primary)]" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-[var(--color-text-light)]">On orders $50+</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-[var(--color-primary)]" />
                <p className="text-sm font-medium">Secure Payment</p>
                <p className="text-xs text-[var(--color-text-light)]">100% Protected</p>
              </div>
              <div className="text-center">
                <RefreshCw className="w-8 h-8 mx-auto mb-2 text-[var(--color-primary)]" />
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-[var(--color-text-light)]">30 Day Policy</p>
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mt-6">
                <span className="text-sm text-[var(--color-text-light)]">Tags: </span>
                <div className="inline-flex flex-wrap gap-2 mt-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, index) => (
                <ProductCard key={p.id} product={p} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
