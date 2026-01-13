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
  ChevronDown
} from 'lucide-react';
import { useStore } from '@/store/useStore';

const categories = [
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
  const { getCartCount, searchQuery, setSearchQuery, currentUser } = useStore();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top Bar */}
      <div className="bg-[var(--color-primary)] text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <p className="hidden sm:block">✨ Free shipping on orders over $50</p>
          <p className="sm:hidden text-center w-full">✨ Free shipping over $50</p>
          <div className="hidden sm:flex items-center gap-4">
            <span>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center"
            >
              <span className="text-[var(--color-secondary)] font-bold text-xl">T</span>
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-[var(--color-primary)]">Tansiq Hub</span>
              <span className="text-xs text-[var(--color-text-light)]">تنسيق هب</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link 
              href="/"
              className="text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors font-medium"
            >
              Home
            </Link>
            
            {/* Categories Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsCategoriesOpen(true)}
              onMouseLeave={() => setIsCategoriesOpen(false)}
            >
              <button className="flex items-center gap-1 text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors font-medium">
                Categories
                <ChevronDown className={`w-4 h-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isCategoriesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-[var(--color-border)] overflow-hidden"
                  >
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="block px-4 py-3 hover:bg-[var(--color-background)] text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors border-b border-[var(--color-border)] last:border-0"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link 
              href="/products"
              className="text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors font-medium"
            >
              Shop
            </Link>
            <Link 
              href="/about"
              className="text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors font-medium"
            >
              About
            </Link>
            <Link 
              href="/contact"
              className="text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors font-medium"
            >
              Contact
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-[var(--color-border)] rounded-full focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-light)]" />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 hover:bg-[var(--color-background)] rounded-full transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist - Coming Soon */}
            <button 
              onClick={() => alert('Wishlist feature coming soon!')}
              className="hidden sm:flex p-2 hover:bg-[var(--color-background)] rounded-full transition-colors relative"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link 
              href="/cart"
              className="p-2 hover:bg-[var(--color-background)] rounded-full transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {getCartCount() > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-secondary)] text-[var(--color-primary-dark)] text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {getCartCount()}
                </motion.span>
              )}
            </Link>

            {/* User Profile/Login */}
            <Link 
              href="/profile"
              className="hidden sm:flex p-2 hover:bg-[var(--color-background)] rounded-full transition-colors"
              title="Profile"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-[var(--color-background)] rounded-full transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden mt-4 overflow-hidden"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-[var(--color-border)] rounded-full focus:outline-none focus:border-[var(--color-primary)]"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-light)]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white border-t border-[var(--color-border)] overflow-hidden"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
              <Link 
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 hover:bg-[var(--color-background)] rounded-lg transition-colors font-medium"
              >
                Home
              </Link>
              <Link 
                href="/products"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 hover:bg-[var(--color-background)] rounded-lg transition-colors font-medium"
              >
                Shop All
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 hover:bg-[var(--color-background)] rounded-lg transition-colors text-[var(--color-text-light)]"
                >
                  {category.name}
                </Link>
              ))}
              <Link 
                href="/about"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 hover:bg-[var(--color-background)] rounded-lg transition-colors font-medium"
              >
                About
              </Link>
              <Link 
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 hover:bg-[var(--color-background)] rounded-lg transition-colors font-medium"
              >
                Contact
              </Link>
              {currentUser ? (
                <>
                  <Link 
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 bg-[var(--color-primary)] text-white rounded-lg transition-colors font-medium text-center mt-2"
                  >
                    My Profile
                  </Link>
                  {currentUser.role === 'admin' && (
                    <Link 
                      href="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-3 bg-[var(--color-secondary)] text-[var(--color-primary-dark)] rounded-lg transition-colors font-medium text-center mt-2"
                    >
                      Admin Panel
                    </Link>
                  )}
                </>
              ) : (
                <Link 
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 bg-[var(--color-primary)] text-white rounded-lg transition-colors font-medium text-center mt-2"
                >
                  Sign In
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
