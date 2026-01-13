'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Menu, 
  X, 
  User, 
  Heart,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { useStore } from '@/store/useStore';

const categories = [
  { name: 'All Products', href: '/products' },
  { name: 'Organic Foods', href: '/products?category=Organic+Foods' },
  { name: 'Books', href: '/products?category=Books' },
  { name: 'Clothing', href: '/products?category=Clothing' },
  { name: 'Home & Decor', href: '/products?category=Home+%26+Decor' },
  { name: 'Health & Beauty', href: '/products?category=Health+%26+Beauty' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const { getCartCount, searchQuery, setSearchQuery, currentUser, cart, getCartTotal } = useStore();
  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Promo Bar */}
      <div className="bg-[var(--color-bg-cream)] py-2 border-b border-[var(--color-border-light)]">
        <div className="max-w-7xl mx-auto px-4 flex justify-center items-center text-sm">
          <p className="text-[var(--color-text-muted)] flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-[var(--color-secondary)] rounded-full animate-pulse"></span>
            Free shipping on orders over $50 — 
            <Link href="/products" className="text-[var(--color-text)] font-medium underline underline-offset-2 hover:text-[var(--color-secondary)] transition-colors">
              Shop Now
            </Link>
          </p>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-[var(--color-border-light)]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Left Section - Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-10 h-10 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center"
              >
                <span className="text-white font-bold text-lg">T</span>
              </motion.div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xl font-bold text-[var(--color-text)]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Tansiq Hub
                </span>
              </div>
            </Link>

            {/* Center Section - Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3 pl-12 bg-[var(--color-bg-cream)] border-none rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/30 text-[var(--color-text)] placeholder:text-[var(--color-text-light)]"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-[var(--color-text-light)] rounded-full flex items-center justify-center hover:bg-[var(--color-text-muted)] transition-colors"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-2.5 hover:bg-[var(--color-bg-cream)] rounded-full transition-colors"
              >
                <Search className="w-5 h-5 text-[var(--color-text)]" />
              </button>

              {/* User Account */}
              <Link 
                href={currentUser ? '/profile' : '/login'}
                className="hidden sm:flex items-center gap-2 px-3 py-2.5 hover:bg-[var(--color-bg-cream)] rounded-full transition-colors"
              >
                <User className="w-5 h-5 text-[var(--color-text)]" />
                <span className="text-sm font-medium text-[var(--color-text)]">
                  {currentUser ? 'Account' : 'Login'}
                </span>
              </Link>

              {/* Wishlist */}
              <button className="p-2.5 hover:bg-[var(--color-bg-cream)] rounded-full transition-colors relative">
                <Heart className="w-5 h-5 text-[var(--color-text)]" />
              </button>

              {/* Cart */}
              <Link 
                href="/cart"
                className="flex items-center gap-3 px-4 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] rounded-full transition-colors"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 text-white" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-[var(--color-secondary)] text-[var(--color-primary)] text-xs font-bold rounded-full flex items-center justify-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </div>
                <span className="hidden sm:inline text-white font-medium">
                  ${cartTotal.toFixed(2)}
                </span>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2.5 hover:bg-[var(--color-bg-cream)] rounded-full transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-[var(--color-text)]" />
                ) : (
                  <Menu className="w-5 h-5 text-[var(--color-text)]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="hidden lg:block border-b border-[var(--color-border-light)] bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {/* Categories Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsCategoriesOpen(true)}
                onMouseLeave={() => setIsCategoriesOpen(false)}
              >
                <button className="flex items-center gap-2 px-4 py-4 text-[var(--color-text)] hover:text-[var(--color-secondary)] transition-colors font-medium">
                  <Menu className="w-4 h-4" />
                  Categories
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isCategoriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-0 w-64 bg-white rounded-2xl shadow-soft-lg border border-[var(--color-border-light)] overflow-hidden py-2"
                    >
                      {categories.map((category) => (
                        <Link
                          key={category.name}
                          href={category.href}
                          className="flex items-center justify-between px-4 py-3 hover:bg-[var(--color-bg-cream)] text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors group"
                        >
                          {category.name}
                          <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link 
                href="/"
                className="px-4 py-4 text-[var(--color-text)] hover:text-[var(--color-secondary)] transition-colors font-medium"
              >
                Home
              </Link>
              <Link 
                href="/products"
                className="px-4 py-4 text-[var(--color-text)] hover:text-[var(--color-secondary)] transition-colors font-medium"
              >
                Shop
              </Link>
              <Link 
                href="/products?featured=true"
                className="px-4 py-4 text-[var(--color-text)] hover:text-[var(--color-secondary)] transition-colors font-medium"
              >
                Best Sellers
              </Link>
              <Link 
                href="/products?sale=true"
                className="px-4 py-4 text-[var(--color-secondary)] font-semibold flex items-center gap-1"
              >
                <span className="w-2 h-2 bg-[var(--color-orange)] rounded-full"></span>
                Sale
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link 
                href="/about"
                className="px-4 py-4 text-[var(--color-text)] hover:text-[var(--color-secondary)] transition-colors font-medium"
              >
                About
              </Link>
              <Link 
                href="/contact"
                className="px-4 py-4 text-[var(--color-text)] hover:text-[var(--color-secondary)] transition-colors font-medium"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search Dropdown */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-[var(--color-border-light)] bg-white overflow-hidden"
          >
            <div className="p-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3 pl-12 bg-[var(--color-bg-cream)] border-none rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/30"
                  autoFocus
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-[var(--color-border-light)] overflow-hidden"
          >
            <nav className="py-4 px-4 space-y-1">
              <Link 
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[var(--color-bg-cream)] text-[var(--color-text)] font-medium"
              >
                Home
                <ArrowRight className="w-4 h-4 text-[var(--color-text-light)]" />
              </Link>
              <Link 
                href="/products"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[var(--color-bg-cream)] text-[var(--color-text)] font-medium"
              >
                Shop All
                <ArrowRight className="w-4 h-4 text-[var(--color-text-light)]" />
              </Link>
              
              <div className="px-4 py-2">
                <p className="text-xs uppercase tracking-wider text-[var(--color-text-light)] font-semibold mb-2">Categories</p>
              </div>
              
              {categories.slice(1).map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[var(--color-bg-cream)] text-[var(--color-text-muted)]"
                >
                  {category.name}
                  <ArrowRight className="w-4 h-4 text-[var(--color-text-light)]" />
                </Link>
              ))}
              
              <div className="border-t border-[var(--color-border-light)] mt-4 pt-4">
                <Link 
                  href={currentUser ? '/profile' : '/login'}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--color-bg-cream)] text-[var(--color-text)] font-medium"
                >
                  <User className="w-5 h-5" />
                  {currentUser ? 'My Account' : 'Login / Register'}
                </Link>
                <Link 
                  href="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[var(--color-bg-cream)] text-[var(--color-text)] font-medium"
                >
                  About Us
                  <ArrowRight className="w-4 h-4 text-[var(--color-text-light)]" />
                </Link>
                <Link 
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[var(--color-bg-cream)] text-[var(--color-text)] font-medium"
                >
                  Contact
                  <ArrowRight className="w-4 h-4 text-[var(--color-text-light)]" />
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
