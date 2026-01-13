'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  ChevronDown,
  X,
  Package,
  Image as ImageIcon,
  DollarSign,
  Tag,
} from 'lucide-react';
import { useStore, Product } from '@/store/useStore';
import Link from 'next/link';

export default function AdminProductsPage() {
  const { products, deleteProduct, updateProduct } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});

  const categories = ['All', ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsModalOpen(true);
  };

  const openNewModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'Organic Foods',
      image: '',
      stock: 0,
      rating: 0,
      reviews: 0,
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      // Add new product
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name || '',
        description: formData.description || '',
        price: formData.price || 0,
        category: formData.category || 'Organic Foods',
        image: formData.image || 'https://via.placeholder.com/500',
        stock: formData.stock || 0,
        rating: formData.rating || 0,
        reviews: formData.reviews || 0,
      };
      useStore.getState().addProduct(newProduct);
    }
    setIsModalOpen(false);
    setFormData({});
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Products</h1>
          <p className="text-[var(--color-text-light)]">
            Manage your product inventory
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openNewModal}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-light)]" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] bg-white"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="appearance-none px-4 py-3 pr-10 border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] bg-white cursor-pointer min-w-[180px]"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-light)] pointer-events-none" />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text)]">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--color-text)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filteredProducts.map((product) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-[var(--color-text)] line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-sm text-[var(--color-text-light)] line-clamp-1">
                          {product.nameArabic}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm rounded-full">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-[var(--color-text)]">
                        ${product.price.toFixed(2)}
                      </p>
                      {product.originalPrice && (
                        <p className="text-sm text-[var(--color-text-light)] line-through">
                          ${product.originalPrice.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{product.stock}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        product.stock > 10
                          ? 'bg-green-100 text-green-700'
                          : product.stock > 0
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.stock > 10
                        ? 'In Stock'
                        : product.stock > 0
                        ? 'Low Stock'
                        : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/products/${product.id}`}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-5 h-5 text-[var(--color-text-light)]" />
                      </Link>
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5 text-blue-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 mx-auto mb-4 text-[var(--color-text-light)]" />
            <p className="text-[var(--color-text)]">No products found</p>
            <p className="text-sm text-[var(--color-text-light)]">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
                <h2 className="text-xl font-bold">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Name
                  </label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-light)]" />
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)]"
                      placeholder="Enter product name"
                    />
                  </div>
                </div>

                {/* Arabic Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Arabic Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.nameArabic || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, nameArabic: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)]"
                    placeholder="أدخل اسم المنتج بالعربية"
                    dir="rtl"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] resize-none"
                    placeholder="Enter product description"
                  />
                </div>

                {/* Price & Original Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-light)]" />
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, price: parseFloat(e.target.value) })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)]"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Original Price (Optional)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-light)]" />
                      <input
                        type="number"
                        step="0.01"
                        value={formData.originalPrice || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            originalPrice: parseFloat(e.target.value),
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)]"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                {/* Category & Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-light)]" />
                      <select
                        value={formData.category || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] appearance-none cursor-pointer"
                      >
                        <option value="Organic Foods">Organic Foods</option>
                        <option value="Books">Books</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Home & Decor">Home & Decor</option>
                        <option value="Health & Beauty">Health & Beauty</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={formData.stock || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)]"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Image URL
                  </label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-light)]" />
                    <input
                      type="text"
                      value={formData.image || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)]"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                {/* Flags */}
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured || false}
                      onChange={(e) =>
                        setFormData({ ...formData, featured: e.target.checked })
                      }
                      className="w-5 h-5 accent-[var(--color-primary)]"
                    />
                    <span>Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNew || false}
                      onChange={(e) =>
                        setFormData({ ...formData, isNew: e.target.checked })
                      }
                      className="w-5 h-5 accent-[var(--color-primary)]"
                    />
                    <span>New Arrival</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isBestseller || false}
                      onChange={(e) =>
                        setFormData({ ...formData, isBestseller: e.target.checked })
                      }
                      className="w-5 h-5 accent-[var(--color-primary)]"
                    />
                    <span>Bestseller</span>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-4 p-6 border-t border-[var(--color-border)]">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 border border-[var(--color-border)] rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors"
                >
                  {editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
