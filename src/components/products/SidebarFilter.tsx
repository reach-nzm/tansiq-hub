'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Star } from 'lucide-react';
import { Product } from '@/store/useStore';
import ProductCard from './ProductCardNew';

interface SidebarFilterProps {
  products: Product[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const categories = [
  { name: 'All Products', count: 0 },
  { name: 'Organic Foods', count: 12 },
  { name: 'Books', count: 8 },
  { name: 'Clothing', count: 15 },
  { name: 'Home & Decor', count: 10 },
  { name: 'Health & Beauty', count: 7 },
];

const colors = [
  { name: 'White', hex: '#FFFFFF', count: 12 },
  { name: 'Black', hex: '#1a1a1a', count: 8 },
  { name: 'Brown', hex: '#8B4513', count: 6 },
  { name: 'Green', hex: '#22c55e', count: 5 },
  { name: 'Blue', hex: '#3b82f6', count: 4 },
  { name: 'Gold', hex: '#f59e0b', count: 3 },
];

const ratings = [5, 4, 3, 2, 1];

export default function SidebarFilter({
  products,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  isOpen = false,
  onClose,
}: SidebarFilterProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    colors: true,
    rating: false,
  });
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  // Calculate category counts from actual products
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All Products': products.length };
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Get best sellers for the sidebar widget
  const bestSellers = useMemo(() => {
    return [...products]
      .filter(p => p.isBestseller)
      .slice(0, 3);
  }, [products]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleColor = (colorName: string) => {
    setSelectedColors(prev => 
      prev.includes(colorName) 
        ? prev.filter(c => c !== colorName)
        : [...prev, colorName]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory('All Products');
    setPriceRange([0, 200]);
    setSelectedColors([]);
    setSelectedRating(null);
  };

  const hasActiveFilters = selectedCategory !== 'All Products' || 
    priceRange[0] > 0 || 
    priceRange[1] < 200 || 
    selectedColors.length > 0 ||
    selectedRating !== null;

  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Clear All Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="w-full py-2.5 px-4 bg-[var(--color-bg-cream)] hover:bg-[var(--color-bg-beige)] rounded-xl text-sm font-medium text-[var(--color-text)] transition-colors"
        >
          Clear All Filters
        </button>
      )}

      {/* Categories Section */}
      <div className="bg-white rounded-2xl border border-[var(--color-border-light)] overflow-hidden">
        <button
          onClick={() => toggleSection('categories')}
          className="w-full flex items-center justify-between p-4 hover:bg-[var(--color-bg-cream)] transition-colors"
        >
          <span className="font-semibold text-[var(--color-text)]">Categories</span>
          <ChevronDown className={`w-5 h-5 text-[var(--color-text-muted)] transition-transform duration-200 ${expandedSections.categories ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {expandedSections.categories && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-1">
                {categories.map((category) => (
                  <label
                    key={category.name}
                    className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-[var(--color-bg-cream)] cursor-pointer transition-colors group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategory === category.name || (selectedCategory === 'All' && category.name === 'All Products')}
                      onChange={() => setSelectedCategory(category.name === 'All Products' ? 'All' : category.name)}
                      className="shrink-0"
                    />
                    <span className="flex-1 text-[var(--color-text)] group-hover:text-[var(--color-primary)]">
                      {category.name}
                    </span>
                    <span className="text-sm text-[var(--color-text-light)] bg-[var(--color-bg-cream)] px-2 py-0.5 rounded-full">
                      {categoryCounts[category.name] || 0}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price Range Section */}
      <div className="bg-white rounded-2xl border border-[var(--color-border-light)] overflow-hidden">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between p-4 hover:bg-[var(--color-bg-cream)] transition-colors"
        >
          <span className="font-semibold text-[var(--color-text)]">Price Range</span>
          <ChevronDown className={`w-5 h-5 text-[var(--color-text-muted)] transition-transform duration-200 ${expandedSections.price ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {expandedSections.price && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-4">
                {/* Price Display */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 bg-[var(--color-bg-cream)] rounded-xl px-4 py-2 text-center">
                    <span className="text-sm text-[var(--color-text-muted)]">Min</span>
                    <p className="font-semibold text-[var(--color-text)]">${priceRange[0]}</p>
                  </div>
                  <span className="text-[var(--color-text-light)]">—</span>
                  <div className="flex-1 bg-[var(--color-bg-cream)] rounded-xl px-4 py-2 text-center">
                    <span className="text-sm text-[var(--color-text-muted)]">Max</span>
                    <p className="font-semibold text-[var(--color-text)]">${priceRange[1]}</p>
                  </div>
                </div>

                {/* Dual Range Slider */}
                <div className="relative pt-2">
                  <div className="relative h-2 bg-[var(--color-border)] rounded-full">
                    <div 
                      className="absolute h-full bg-[var(--color-secondary)] rounded-full"
                      style={{
                        left: `${(priceRange[0] / 200) * 100}%`,
                        right: `${100 - (priceRange[1] / 200) * 100}%`
                      }}
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[0]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value < priceRange[1]) {
                        setPriceRange([value, priceRange[1]]);
                      }
                    }}
                    className="absolute top-0 left-0 w-full h-6 opacity-0 cursor-pointer"
                  />
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[1]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value > priceRange[0]) {
                        setPriceRange([priceRange[0], value]);
                      }
                    }}
                    className="absolute top-0 left-0 w-full h-6 opacity-0 cursor-pointer"
                  />
                  {/* Thumb indicators */}
                  <div 
                    className="absolute top-0 w-5 h-5 bg-white border-4 border-[var(--color-secondary)] rounded-full -translate-y-1/2 shadow-sm pointer-events-none"
                    style={{ left: `calc(${(priceRange[0] / 200) * 100}% - 10px)` }}
                  />
                  <div 
                    className="absolute top-0 w-5 h-5 bg-white border-4 border-[var(--color-secondary)] rounded-full -translate-y-1/2 shadow-sm pointer-events-none"
                    style={{ left: `calc(${(priceRange[1] / 200) * 100}% - 10px)` }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Colors Section */}
      <div className="bg-white rounded-2xl border border-[var(--color-border-light)] overflow-hidden">
        <button
          onClick={() => toggleSection('colors')}
          className="w-full flex items-center justify-between p-4 hover:bg-[var(--color-bg-cream)] transition-colors"
        >
          <span className="font-semibold text-[var(--color-text)]">Colors</span>
          <ChevronDown className={`w-5 h-5 text-[var(--color-text-muted)] transition-transform duration-200 ${expandedSections.colors ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {expandedSections.colors && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4">
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => toggleColor(color.name)}
                      className="flex flex-col items-center gap-1.5 group"
                      title={`${color.name} (${color.count})`}
                    >
                      <div 
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColors.includes(color.name) 
                            ? 'border-[var(--color-primary)] scale-110' 
                            : 'border-[var(--color-border)] group-hover:border-[var(--color-text-light)]'
                        } ${color.name === 'White' ? 'border-[var(--color-border)]' : ''}`}
                        style={{ backgroundColor: color.hex }}
                      >
                        {selectedColors.includes(color.name) && (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className={`w-4 h-4 ${color.name === 'White' || color.name === 'Gold' ? 'text-[var(--color-primary)]' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-[var(--color-text-muted)]">{color.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rating Section */}
      <div className="bg-white rounded-2xl border border-[var(--color-border-light)] overflow-hidden">
        <button
          onClick={() => toggleSection('rating')}
          className="w-full flex items-center justify-between p-4 hover:bg-[var(--color-bg-cream)] transition-colors"
        >
          <span className="font-semibold text-[var(--color-text)]">Rating</span>
          <ChevronDown className={`w-5 h-5 text-[var(--color-text-muted)] transition-transform duration-200 ${expandedSections.rating ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {expandedSections.rating && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-2">
                {ratings.map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                    className={`w-full flex items-center gap-3 py-2 px-3 rounded-xl transition-colors ${
                      selectedRating === rating 
                        ? 'bg-[var(--color-secondary)]/10' 
                        : 'hover:bg-[var(--color-bg-cream)]'
                    }`}
                  >
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < rating ? 'text-[var(--color-secondary)] fill-[var(--color-secondary)]' : 'text-[var(--color-border)]'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-[var(--color-text-muted)]">& Up</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Best Sellers Widget */}
      {bestSellers.length > 0 && (
        <div className="bg-white rounded-2xl border border-[var(--color-border-light)] overflow-hidden">
          <div className="p-4 border-b border-[var(--color-border-light)]">
            <span className="font-semibold text-[var(--color-text)]">Best Sellers</span>
          </div>
          <div className="p-3 space-y-1">
            {bestSellers.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={index}
                variant="horizontal" 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Mobile Drawer Version
  if (isOpen !== undefined && onClose) {
    return (
      <>
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <SidebarContent />
        </aside>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              />
              
              {/* Drawer */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-[var(--color-bg-cream)] z-50 lg:hidden overflow-y-auto"
              >
                {/* Drawer Header */}
                <div className="sticky top-0 flex items-center justify-between p-4 bg-white border-b border-[var(--color-border-light)]">
                  <h2 className="text-lg font-semibold text-[var(--color-text)]">Filters</h2>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--color-bg-cream)] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Drawer Content */}
                <div className="p-4">
                  <SidebarContent />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Default Desktop Only Version
  return (
    <aside className="w-72 shrink-0">
      <SidebarContent />
    </aside>
  );
}
