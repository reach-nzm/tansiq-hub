import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  nameArabic?: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  image: string;
  images?: string[];
  stock: number;
  rating: number;
  reviews: number;
  tags?: string[];
  featured?: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'admin';
  createdAt: string;
  orders?: number;
  totalSpent?: number;
}

interface StoreState {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  // Products
  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;

  // Orders
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Users
  users: User[];
  setUsers: (users: User[]) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  // UI State
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}

// Sample Products Data
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Dates - Premium Medjool',
    nameArabic: 'تمر مجدول عضوي',
    description: 'Premium quality organic Medjool dates from the finest farms. Rich in nutrients and naturally sweet.',
    price: 24.99,
    originalPrice: 29.99,
    category: 'Organic Foods',
    subcategory: 'Dates & Dried Fruits',
    image: 'https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?w=500',
    stock: 150,
    rating: 4.9,
    reviews: 234,
    tags: ['organic', 'halal', 'natural'],
    featured: true,
    isBestseller: true,
  },
  {
    id: '2',
    name: 'Holy Quran - Leather Bound Edition',
    nameArabic: 'المصحف الشريف',
    description: 'Beautiful leather-bound Quran with gold embossing. Clear Arabic text with English translation.',
    price: 49.99,
    category: 'Books',
    subcategory: 'Islamic Books',
    image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=500',
    stock: 75,
    rating: 5.0,
    reviews: 189,
    tags: ['quran', 'islamic', 'gift'],
    featured: true,
  },
  {
    id: '3',
    name: 'Premium Hijab Collection - Chiffon',
    nameArabic: 'حجاب شيفون فاخر',
    description: 'Elegant chiffon hijab in beautiful emerald green. Soft, breathable, and perfect for all occasions.',
    price: 19.99,
    originalPrice: 24.99,
    category: 'Clothing',
    subcategory: 'Hijabs',
    image: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28f8e?w=500',
    stock: 200,
    rating: 4.8,
    reviews: 156,
    tags: ['hijab', 'modest', 'fashion'],
    featured: true,
    isNew: true,
  },
  {
    id: '4',
    name: 'Black Seed Oil - Cold Pressed',
    nameArabic: 'زيت الحبة السوداء',
    description: '100% pure cold-pressed black seed oil. Known for its numerous health benefits.',
    price: 18.99,
    category: 'Organic Foods',
    subcategory: 'Oils & Honey',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500',
    stock: 120,
    rating: 4.7,
    reviews: 98,
    tags: ['organic', 'health', 'natural'],
    isBestseller: true,
  },
  {
    id: '5',
    name: 'Men\'s Thobe - White Premium Cotton',
    nameArabic: 'ثوب رجالي قطن',
    description: 'Classic white thobe made from premium Egyptian cotton. Comfortable and elegant.',
    price: 59.99,
    originalPrice: 79.99,
    category: 'Clothing',
    subcategory: 'Men\'s Wear',
    image: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=500',
    stock: 80,
    rating: 4.6,
    reviews: 67,
    tags: ['thobe', 'modest', 'men'],
  },
  {
    id: '6',
    name: 'Organic Raw Honey - Sidr',
    nameArabic: 'عسل سدر طبيعي',
    description: 'Premium Sidr honey from Yemen. Raw, unprocessed, and rich in natural enzymes.',
    price: 34.99,
    category: 'Organic Foods',
    subcategory: 'Oils & Honey',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500',
    stock: 60,
    rating: 4.9,
    reviews: 145,
    tags: ['organic', 'honey', 'natural'],
    featured: true,
  },
  {
    id: '7',
    name: 'Islamic Art Print - Ayatul Kursi',
    nameArabic: 'لوحة آية الكرسي',
    description: 'Beautiful calligraphy print of Ayatul Kursi. Perfect for home decoration.',
    price: 39.99,
    category: 'Home & Decor',
    subcategory: 'Wall Art',
    image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=500',
    stock: 45,
    rating: 4.8,
    reviews: 89,
    tags: ['art', 'islamic', 'decor'],
    isNew: true,
  },
  {
    id: '8',
    name: 'Riyad as-Salihin - English Translation',
    nameArabic: 'رياض الصالحين',
    description: 'Classic collection of hadith compiled by Imam An-Nawawi. Comprehensive English translation.',
    price: 29.99,
    category: 'Books',
    subcategory: 'Islamic Books',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
    stock: 90,
    rating: 4.9,
    reviews: 112,
    tags: ['hadith', 'islamic', 'book'],
  },
  {
    id: '9',
    name: 'Prayer Mat - Velvet Embroidered',
    nameArabic: 'سجادة صلاة مخملية',
    description: 'Luxurious velvet prayer mat with beautiful Islamic geometric embroidery.',
    price: 44.99,
    originalPrice: 54.99,
    category: 'Home & Decor',
    subcategory: 'Prayer Items',
    image: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=500',
    stock: 100,
    rating: 4.7,
    reviews: 78,
    tags: ['prayer', 'islamic', 'home'],
    featured: true,
  },
  {
    id: '10',
    name: 'Organic Saffron - Grade A',
    nameArabic: 'زعفران عضوي',
    description: 'Premium Grade A saffron threads. Perfect for cooking and traditional remedies.',
    price: 15.99,
    category: 'Organic Foods',
    subcategory: 'Spices',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500',
    stock: 200,
    rating: 4.8,
    reviews: 56,
    tags: ['organic', 'spice', 'cooking'],
  },
  {
    id: '11',
    name: 'Abaya - Black Embroidered',
    nameArabic: 'عباية مطرزة',
    description: 'Elegant black abaya with delicate gold embroidery. Made from premium nida fabric.',
    price: 89.99,
    originalPrice: 109.99,
    category: 'Clothing',
    subcategory: 'Women\'s Wear',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500',
    stock: 50,
    rating: 4.9,
    reviews: 134,
    tags: ['abaya', 'modest', 'women'],
    isBestseller: true,
  },
  {
    id: '12',
    name: 'Miswak - Natural Toothbrush',
    nameArabic: 'مسواك طبيعي',
    description: 'Pack of 5 natural miswak sticks. Traditional oral hygiene used for centuries.',
    price: 9.99,
    category: 'Health & Beauty',
    subcategory: 'Oral Care',
    image: 'https://images.unsplash.com/photo-1628359355624-855775b5c9c4?w=500',
    stock: 300,
    rating: 4.6,
    reviews: 203,
    tags: ['natural', 'health', 'sunnah'],
  },
];

// Sample Orders
const sampleOrders: Order[] = [
  {
    id: 'ORD001',
    items: [sampleProducts[0] as CartItem, sampleProducts[1] as CartItem].map(p => ({ ...p, quantity: 2 })),
    total: 149.96,
    status: 'delivered',
    customer: {
      name: 'Ahmad Hassan',
      email: 'ahmad@example.com',
      phone: '+1234567890',
      address: '123 Islamic Center Rd',
      city: 'Dubai',
      country: 'UAE',
    },
    createdAt: '2026-01-10T10:30:00Z',
    updatedAt: '2026-01-12T14:20:00Z',
  },
  {
    id: 'ORD002',
    items: [sampleProducts[2] as CartItem].map(p => ({ ...p, quantity: 3 })),
    total: 59.97,
    status: 'processing',
    customer: {
      name: 'Fatima Ali',
      email: 'fatima@example.com',
      phone: '+0987654321',
      address: '456 Medina Street',
      city: 'Riyadh',
      country: 'Saudi Arabia',
    },
    createdAt: '2026-01-12T08:15:00Z',
    updatedAt: '2026-01-12T08:15:00Z',
  },
  {
    id: 'ORD003',
    items: [sampleProducts[5] as CartItem, sampleProducts[8] as CartItem].map(p => ({ ...p, quantity: 1 })),
    total: 79.98,
    status: 'shipped',
    customer: {
      name: 'Omar Khan',
      email: 'omar@example.com',
      phone: '+1122334455',
      address: '789 Al Falah Ave',
      city: 'London',
      country: 'UK',
    },
    createdAt: '2026-01-11T16:45:00Z',
    updatedAt: '2026-01-12T10:30:00Z',
  },
  {
    id: 'ORD004',
    items: [sampleProducts[3] as CartItem].map(p => ({ ...p, quantity: 2 })),
    total: 37.98,
    status: 'pending',
    customer: {
      name: 'Aisha Rahman',
      email: 'aisha@example.com',
      phone: '+5566778899',
      address: '321 Salam Road',
      city: 'Toronto',
      country: 'Canada',
    },
    createdAt: '2026-01-13T09:00:00Z',
    updatedAt: '2026-01-13T09:00:00Z',
  },
];

// Sample Users
const sampleUsers: User[] = [
  {
    id: 'USR001',
    name: 'Ahmad Hassan',
    email: 'ahmad@example.com',
    phone: '+1234567890',
    role: 'customer',
    createdAt: '2025-06-15T10:00:00Z',
    orders: 12,
    totalSpent: 1245.50,
  },
  {
    id: 'USR002',
    name: 'Fatima Ali',
    email: 'fatima@example.com',
    phone: '+0987654321',
    role: 'customer',
    createdAt: '2025-08-20T14:30:00Z',
    orders: 8,
    totalSpent: 678.25,
  },
  {
    id: 'USR003',
    name: 'Omar Khan',
    email: 'omar@example.com',
    phone: '+1122334455',
    role: 'customer',
    createdAt: '2025-10-05T09:15:00Z',
    orders: 5,
    totalSpent: 423.00,
  },
  {
    id: 'ADMIN001',
    name: 'Admin User',
    email: 'admin@tansiqhub.com',
    role: 'admin',
    createdAt: '2025-01-01T00:00:00Z',
  },
];

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart
      cart: [],
      addToCart: (product) => {
        const cart = get().cart;
        const existingItem = cart.find((item) => item.id === product.id);
        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ cart: [...cart, { ...product, quantity: 1 }] });
        }
      },
      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((item) => item.id !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        return get().cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
      getCartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },

      // Products
      products: sampleProducts,
      setProducts: (products) => set({ products }),
      addProduct: (product) => set({ products: [...get().products, product] }),
      updateProduct: (productId, updates) => {
        set({
          products: get().products.map((product) =>
            product.id === productId ? { ...product, ...updates } : product
          ),
        });
      },
      deleteProduct: (productId) => {
        set({ products: get().products.filter((p) => p.id !== productId) });
      },

      // Orders
      orders: sampleOrders,
      setOrders: (orders) => set({ orders }),
      addOrder: (order) => set({ orders: [...get().orders, order] }),
      updateOrderStatus: (orderId, status) => {
        set({
          orders: get().orders.map((order) =>
            order.id === orderId
              ? { ...order, status, updatedAt: new Date().toISOString() }
              : order
          ),
        });
      },

      // Users
      users: sampleUsers,
      setUsers: (users) => set({ users }),
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),

      // UI State
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      selectedCategory: 'All',
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      priceRange: [0, 200],
      setPriceRange: (range) => set({ priceRange: range }),
    }),
    {
      name: 'tansiq-hub-storage',
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
