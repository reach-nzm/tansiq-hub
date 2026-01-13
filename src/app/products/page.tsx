'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronDown, Grid, List, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { useStore } from '@/store/useStore';

const categories = ['All', 'Organic Foods', 'Books', 'Clothing', 'Home & Decor', 'Health & Beauty'];
const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const { products, searchQuery, setSearchQuery } = useStore();
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.tags?.some((t) => t.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Price filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header Banner */}
      <div className="bg-[var(--color-primary)] py-12 islamic-pattern">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl font-bold mb-2">Our Products</h1>
            <p className="text-white/80">منتجاتنا المباركة</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 bg-white"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-light)]" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <X className="w-5 h-5 text-[var(--color-text-light)]" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none px-4 py-3 pr-10 border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] bg-white cursor-pointer min-w-[180px]"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-light)] pointer-events-none" />
          </div>

          {/* Filter Toggle - Mobile */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden flex items-center justify-center gap-2 px-4 py-3 border border-[var(--color-border)] rounded-xl bg-white"
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </button>

          {/* View Mode Toggle */}
          <div className="hidden md:flex items-center gap-2 border border-[var(--color-border)] rounded-xl p-1 bg-white">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[var(--color-primary)] text-white' : ''}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[var(--color-primary)] text-white' : ''}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h3>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-[var(--color-text)]">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'hover:bg-[var(--color-background)] text-[var(--color-text)]'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-[var(--color-text)]">Price Range</h4>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-[var(--color-primary)]"
                  />
                  <div className="flex justify-between text-sm text-[var(--color-text-light)]">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Reset Filters */}
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setPriceRange([0, 200]);
                  setSearchQuery('');
                }}
                className="w-full py-2 text-[var(--color-primary)] border border-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)] hover:text-white transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Mobile Filters Panel */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 md:hidden"
                onClick={() => setIsFilterOpen(false)}
              >
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'tween' }}
                  className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg">Filters</h3>
                    <button onClick={() => setIsFilterOpen(false)}>
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Categories */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Categories</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setIsFilterOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            selectedCategory === category
                              ? 'bg-[var(--color-primary)] text-white'
                              : 'hover:bg-[var(--color-background)]'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Price Range</h4>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full accent-[var(--color-primary)]"
                    />
                    <div className="flex justify-between text-sm text-[var(--color-text-light)] mt-2">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setPriceRange([0, 200]);
                      setSearchQuery('');
                      setIsFilterOpen(false);
                    }}
                    className="w-full py-3 text-[var(--color-primary)] border border-[var(--color-primary)] rounded-lg"
                  >
                    Reset Filters
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-[var(--color-text-light)]">
                Showing <span className="font-semibold text-[var(--color-text)]">{filteredProducts.length}</span> products
              </p>
              {selectedCategory !== 'All' && (
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="flex items-center gap-1 text-sm text-[var(--color-primary)]"
                >
                  <X className="w-4 h-4" />
                  Clear: {selectedCategory}
                </button>
              )}
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                  No products found
                </h3>
                <p className="text-[var(--color-text-light)] mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setPriceRange([0, 200]);
                    setSearchQuery('');
                  }}
                  className="btn-primary"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--color-primary)] border-t-transparent"></div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
