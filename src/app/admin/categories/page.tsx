'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Package, Image as ImageIcon, ChevronRight } from 'lucide-react';

const categories = [
  {
    id: '1',
    name: 'Organic Foods',
    nameArabic: 'أطعمة عضوية',
    description: 'Pure, natural, and halal food products',
    image: 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?w=400&auto=format&fit=crop',
    productCount: 150,
    subcategories: ['Dates & Dried Fruits', 'Oils & Honey', 'Spices', 'Grains'],
  },
  {
    id: '2',
    name: 'Books',
    nameArabic: 'كتب',
    description: 'Islamic literature and educational materials',
    image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&auto=format&fit=crop',
    productCount: 200,
    subcategories: ['Quran', 'Hadith', 'Islamic History', 'Children Books'],
  },
  {
    id: '3',
    name: 'Clothing',
    nameArabic: 'ملابس',
    description: 'Modest fashion for the whole family',
    image: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=400&auto=format&fit=crop',
    productCount: 300,
    subcategories: ['Hijabs', 'Abayas', 'Thobes', 'Kids Wear'],
  },
  {
    id: '4',
    name: 'Home & Decor',
    nameArabic: 'ديكور المنزل',
    description: 'Islamic art and prayer essentials',
    image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=400&auto=format&fit=crop',
    productCount: 120,
    subcategories: ['Wall Art', 'Prayer Items', 'Calligraphy', 'Rugs'],
  },
  {
    id: '5',
    name: 'Health & Beauty',
    nameArabic: 'الصحة والجمال',
    description: 'Natural and halal personal care',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&auto=format&fit=crop',
    productCount: 80,
    subcategories: ['Oral Care', 'Skincare', 'Hair Care', 'Fragrances'],
  },
];

export default function AdminCategoriesPage() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Categories</h1>
          <p className="text-[var(--color-text-light)]">
            Manage product categories and subcategories
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </motion.button>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-6">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start gap-6">
                {/* Image */}
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-[var(--color-text)]">
                        {category.name}
                      </h3>
                      <p className="text-[var(--color-text-light)]">
                        {category.nameArabic}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="w-5 h-5 text-blue-500" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-[var(--color-text-light)] mt-2">
                    {category.description}
                  </p>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4 text-[var(--color-text-light)]" />
                      <span className="font-medium">{category.productCount}</span>
                      <span className="text-[var(--color-text-light)]">products</span>
                    </div>
                    <button
                      onClick={() =>
                        setExpandedCategory(
                          expandedCategory === category.id ? null : category.id
                        )
                      }
                      className="flex items-center gap-1 text-sm text-[var(--color-primary)] font-medium"
                    >
                      {category.subcategories.length} subcategories
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          expandedCategory === category.id ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Subcategories */}
            {expandedCategory === category.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-[var(--color-border)] bg-gray-50 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Subcategories</h4>
                  <button className="text-sm text-[var(--color-primary)] font-medium flex items-center gap-1">
                    <Plus className="w-4 h-4" />
                    Add Subcategory
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {category.subcategories.map((sub) => (
                    <div
                      key={sub}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-[var(--color-border)]"
                    >
                      <span className="text-sm">{sub}</span>
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Edit className="w-4 h-4 text-[var(--color-text-light)]" />
                        </button>
                        <button className="p-1 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
