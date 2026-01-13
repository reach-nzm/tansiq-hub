'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown, Grid, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/products/ProductCardNew';
import SidebarFilter from '@/components/products/SidebarFilter';
import { useStore } from '@/store/useStore';

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
  const [gridCols, setGridCols] = useState<3 | 4>(3);

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
    if (selectedCategory !== 'All' && selectedCategory !== 'All Products') {
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
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-[var(--color-bg-cream)] py-10 lg:py-14 border-b border-[var(--color-border-light)]">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="inline-block px-4 py-1.5 bg-white text-[var(--color-text-muted)] text-sm font-medium rounded-full mb-4 shadow-soft">
              {filteredProducts.length} Products
            </span>
            <h1 
              className="text-4xl lg:text-5xl font-bold text-[var(--color-text)] mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {selectedCategory === 'All' || selectedCategory === 'All Products' ? 'All Products' : selectedCategory}
            </h1>
            <p className="text-[var(--color-text-muted)] max-w-lg mx-auto">
              Discover our curated collection of premium quality products
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3.5 pl-12 bg-[var(--color-bg-cream)] border-none rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/30"
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

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none px-5 py-3.5 pr-12 bg-white border border-[var(--color-border-light)] rounded-full focus:outline-none focus:border-[var(--color-secondary)] cursor-pointer min-w-[180px]"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)] pointer-events-none" />
          </div>

          {/* Filter Toggle - Mobile */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="lg:hidden flex items-center justify-center gap-2 px-5 py-3.5 bg-[var(--color-primary)] text-white rounded-full font-medium"
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </button>

          {/* Grid Toggle - Desktop */}
          <div className="hidden lg:flex items-center gap-1 bg-[var(--color-bg-cream)] rounded-full p-1">
            <button
              onClick={() => setGridCols(3)}
              className={`p-2.5 rounded-full transition-colors ${gridCols === 3 ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setGridCols(4)}
              className={`p-2.5 rounded-full transition-colors ${gridCols === 4 ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Sidebar Filter */}
          <SidebarFilter
            products={products}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 bg-[var(--color-bg-cream)] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-[var(--color-text-muted)]" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">No products found</h3>
                <p className="text-[var(--color-text-muted)] mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setPriceRange([0, 200]);
                  }}
                  className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-full font-medium hover:bg-[var(--color-primary-light)] transition-colors"
                >
                  Clear All Filters
                </button>
              </motion.div>
            ) : (
              <>
                <div className={`grid gap-6 ${
                  gridCols === 4 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                }`}>
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <ProductCard product={product} index={index} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Load More Button */}
                {filteredProducts.length >= 12 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12 text-center"
                  >
                    <button className="px-8 py-4 bg-[var(--color-bg-cream)] text-[var(--color-text)] rounded-full font-medium hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                      Load More Products
                    </button>
                  </motion.div>
                )}
              </>
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
        <div className="w-8 h-8 border-4 border-[var(--color-secondary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
