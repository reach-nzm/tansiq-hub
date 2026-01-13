// Database Layer - Shopify-like Data Management
// This can be easily swapped with a real database (MongoDB, PostgreSQL, etc.)

import { Product as StoreProduct, Order as StoreOrder, User } from '@/store/useStore';

// Extended Product type for API
export interface Product extends StoreProduct {
  handle?: string;
  compareAtPrice?: number;
}

// Extended Order type for Shopify-like API
export interface Order {
  id: string;
  orderNumber: number;
  email: string;
  customerId?: string;
  items: OrderLineItem[];
  subtotal: number;
  totalDiscount: number;
  totalShipping: number;
  totalTax: number;
  total: number;
  currency: string;
  financialStatus: 'pending' | 'paid' | 'partially_paid' | 'refunded' | 'voided';
  fulfillmentStatus: 'unfulfilled' | 'partial' | 'fulfilled';
  shippingAddress: any;
  billingAddress: any;
  shippingMethod: string;
  paymentMethod: string;
  note?: string;
  tags: string[];
  discountCodes: string[];
  fulfillments: any[];
  refunds: any[];
  createdAt: string;
  updatedAt: string;
  // For compatibility with store Order
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customer?: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  };
}

export interface OrderLineItem {
  id: string;
  productId: string;
  variantId?: string;
  title: string;
  quantity: number;
  price: number;
  totalDiscount: number;
  sku: string;
}

// Extended Customer type
export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  addresses: Address[];
  defaultAddress?: Address;
  totalOrders: number;
  totalSpent: number;
  tags: string[];
  acceptsMarketing: boolean;
  createdAt: string;
  // For compatibility with User type
  name?: string;
  role?: 'customer' | 'admin';
  orders?: number;
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image?: string;
  products: string[]; // Product IDs
  productIds?: string[]; // Alias for compatibility
  sortOrder: 'manual' | 'best-selling' | 'alpha-asc' | 'alpha-desc' | 'price-asc' | 'price-desc' | 'created-desc' | 'created-asc';
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Discount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed_amount' | 'free_shipping';
  value: number;
  minPurchase?: number;
  maxUses?: number;
  usedCount: number;
  startsAt: string;
  endsAt?: string;
  applicableTo: 'all' | 'specific_products' | 'specific_collections';
  productIds?: string[];
  collectionIds?: string[];
  active: boolean;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  variantId?: string;
  sku?: string;
  quantity: number;
  reservedQuantity?: number;
  incomingQuantity?: number;
  lowStockThreshold?: number;
  tracked: boolean;
  updatedAt: string;
}

export interface Inventory extends InventoryItem {}

export interface ShippingRate {
  id: string;
  name: string;
  price: number;
  minOrder?: number;
  maxOrder?: number;
  minDays: number;
  maxDays: number;
  countries?: string[];
  active?: boolean;
}

export interface Cart {
  id: string;
  token: string;
  customerId?: string;
  items: CartItem[];
  discountCodes: string[];
  note: string;
  attributes: Record<string, any>;
  shippingRate: { name: string; price: number } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  title: string;
  image?: string;
  properties: Record<string, any>;
}

export interface Address {
  id?: string;
  first_name?: string;
  last_name?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  country: string;
  zip: string;
  phone?: string;
  default?: boolean;
}

export interface Webhook {
  id: string;
  topic: string;
  address: string;
  format: 'json' | 'xml';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  id: string;
  name: string;
  email: string;
  phone?: string;
  domain: string;
  address: Address;
  currency: string;
  timezone: string;
  weightUnit: 'kg' | 'lb';
  taxesIncluded: boolean;
  taxShipping: boolean;
  createdAt: string;
}

// In-memory database (can be replaced with real DB)
class Database {
  private products: Map<string, Product> = new Map();
  private orders: Map<string, Order> = new Map();
  private customers: Map<string, Customer> = new Map();
  private collections: Map<string, Collection> = new Map();
  private discounts: Map<string, Discount> = new Map();
  private inventory: Map<string, InventoryItem> = new Map();
  private carts: Map<string, Cart> = new Map();
  private shippingRates: Map<string, ShippingRate> = new Map();
  private webhooks: Map<string, Webhook> = new Map();
  private storeSettings: StoreSettings;

  constructor() {
    this.storeSettings = {
      id: 'store-1',
      name: 'Tansiq Hub',
      email: 'support@tansiqhub.com',
      phone: '+1 (555) 000-1234',
      domain: 'tansiqhub.com',
      address: {
        id: 'store-address',
        firstName: 'Tansiq',
        lastName: 'Hub',
        address1: '123 Blessed Lane',
        city: 'Islamic District',
        province: 'State',
        country: 'United States',
        zip: '12345',
        default: true,
      },
      currency: 'USD',
      timezone: 'America/New_York',
      weightUnit: 'kg',
      taxesIncluded: false,
      taxShipping: false,
      createdAt: new Date().toISOString(),
    };
    this.seedData();
  }

  private seedData() {
    // Seed products
    const sampleProducts: Product[] = [
      {
        id: '1',
        name: 'Organic Dates - Premium Medjool',
        nameArabic: 'تمر مجدول عضوي',
        description: 'Premium quality organic Medjool dates sourced from trusted farms. Perfect for breaking fast during Ramadan or as a healthy snack.',
        price: 24.99,
        originalPrice: 29.99,
        category: 'Organic Foods',
        subcategory: 'Dates & Dried Fruits',
        image: 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?w=500&auto=format&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1586776977607-310e9c725c37?w=500&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1597714026720-8f74c62310ba?w=500&auto=format&fit=crop',
        ],
        stock: 150,
        rating: 4.9,
        reviews: 128,
        tags: ['organic', 'halal', 'ramadan', 'healthy'],
        featured: true,
        isBestseller: true,
      },
      {
        id: '2',
        name: 'Raw Honey - Pure Acacia',
        nameArabic: 'عسل السدر الخام',
        description: 'Pure, raw acacia honey. Unprocessed and packed with natural goodness. A sunnah food with numerous health benefits.',
        price: 18.99,
        category: 'Organic Foods',
        subcategory: 'Honey & Spreads',
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop',
        stock: 89,
        rating: 4.8,
        reviews: 95,
        tags: ['organic', 'sunnah', 'natural'],
        featured: true,
      },
      {
        id: '3',
        name: 'Islamic History Encyclopedia',
        nameArabic: 'موسوعة التاريخ الإسلامي',
        description: 'Comprehensive encyclopedia covering Islamic history from the time of Prophet Muhammad (PBUH) to modern day.',
        price: 45.99,
        originalPrice: 55.99,
        category: 'Books',
        subcategory: 'Islamic History',
        image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=500&auto=format&fit=crop',
        stock: 45,
        rating: 4.9,
        reviews: 67,
        tags: ['books', 'history', 'islamic', 'education'],
        featured: true,
        isNew: true,
      },
      {
        id: '4',
        name: 'Premium Hijab Collection',
        nameArabic: 'مجموعة حجاب فاخرة',
        description: 'Elegant and comfortable hijabs made from premium quality fabric. Available in various colors and styles.',
        price: 19.99,
        category: 'Clothing',
        subcategory: 'Hijabs',
        image: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=500&auto=format&fit=crop',
        stock: 200,
        rating: 4.7,
        reviews: 234,
        tags: ['clothing', 'hijab', 'modest', 'fashion'],
        featured: true,
        isBestseller: true,
      },
      {
        id: '5',
        name: 'Islamic Wall Art',
        nameArabic: 'فن جداري إسلامي',
        description: 'Beautiful Islamic calligraphy wall art featuring Ayatul Kursi. Perfect for home or office decoration.',
        price: 49.99,
        category: 'Home & Decor',
        subcategory: 'Wall Art',
        image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=500',
        stock: 75,
        rating: 4.8,
        reviews: 89,
        tags: ['decor', 'calligraphy', 'art', 'home'],
        featured: true,
      },
      {
        id: '6',
        name: 'Herbal Tea - Chamomile Blend',
        nameArabic: 'شاي البابونج العشبي',
        description: 'Soothing chamomile herbal tea blend. Caffeine-free and perfect for relaxation.',
        price: 12.99,
        category: 'Organic Foods',
        subcategory: 'Beverages',
        image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500',
        stock: 120,
        rating: 4.6,
        reviews: 78,
        tags: ['tea', 'herbal', 'organic', 'relaxation'],
      },
      {
        id: '7',
        name: 'Quran with Tafsir',
        nameArabic: 'القرآن مع التفسير',
        description: 'Complete Quran with detailed tafsir (interpretation) by renowned scholars. Arabic text with English translation.',
        price: 55.99,
        category: 'Books',
        subcategory: 'Quran',
        image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=500',
        stock: 60,
        rating: 5.0,
        reviews: 156,
        tags: ['quran', 'tafsir', 'islamic', 'holy'],
        isBestseller: true,
      },
      {
        id: '8',
        name: 'Prayer Mat - Beautifully Designed',
        nameArabic: 'سجادة صلاة مزخرفة',
        description: 'Soft, comfortable prayer mat with beautiful Islamic geometric patterns. Perfect for daily prayers.',
        price: 24.99,
        category: 'Home & Decor',
        subcategory: 'Prayer Essentials',
        image: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=500',
        stock: 180,
        rating: 4.7,
        reviews: 145,
        tags: ['prayer', 'mat', 'islamic', 'worship'],
        isNew: true,
      },
      {
        id: '9',
        name: 'Modest Abaya',
        nameArabic: 'عباية محتشمة',
        description: 'Elegant black abaya with subtle embroidery. Comfortable and modest for everyday wear.',
        price: 89.99,
        originalPrice: 109.99,
        category: 'Clothing',
        subcategory: 'Abayas',
        image: 'https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?w=500&auto=format&fit=crop',
        stock: 65,
        rating: 4.8,
        reviews: 98,
        tags: ['abaya', 'modest', 'clothing', 'elegant'],
      },
      {
        id: '10',
        name: 'Organic Olive Oil - Extra Virgin',
        nameArabic: 'زيت زيتون عضوي بكر',
        description: 'Cold-pressed extra virgin olive oil from organic olives. Perfect for cooking and health benefits.',
        price: 34.99,
        category: 'Organic Foods',
        subcategory: 'Oils',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop',
        stock: 95,
        rating: 4.9,
        reviews: 112,
        tags: ['olive oil', 'organic', 'cooking', 'sunnah'],
      },
      {
        id: '11',
        name: 'Islamic Philosophy Guide',
        nameArabic: 'دليل الفلسفة الإسلامية',
        description: 'In-depth exploration of Islamic philosophy and thought throughout history.',
        price: 32.99,
        category: 'Books',
        subcategory: 'Philosophy',
        image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=500',
        stock: 40,
        rating: 4.7,
        reviews: 45,
        tags: ['philosophy', 'islamic', 'books', 'thought'],
      },
      {
        id: '12',
        name: 'Organic Skincare Set',
        nameArabic: 'مجموعة العناية بالبشرة العضوية',
        description: 'Complete organic skincare set with natural ingredients. Halal certified and cruelty-free.',
        price: 42.99,
        category: 'Health & Beauty',
        subcategory: 'Skincare',
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
        stock: 55,
        rating: 4.6,
        reviews: 67,
        tags: ['skincare', 'organic', 'halal', 'beauty'],
        isNew: true,
      },
    ];

    sampleProducts.forEach(p => this.products.set(p.id, p));

    // Seed inventory
    sampleProducts.forEach(p => {
      this.inventory.set(p.id, {
        id: `inv-${p.id}`,
        productId: p.id,
        sku: `SKU-${p.id.padStart(6, '0')}`,
        quantity: p.stock,
        reservedQuantity: 0,
        incomingQuantity: 0,
        lowStockThreshold: 10,
        tracked: true,
        updatedAt: new Date().toISOString(),
      });
    });

    // Seed collections
    const collections: Collection[] = [
      {
        id: 'col-1',
        title: 'Organic Foods',
        handle: 'organic-foods',
        description: 'Premium organic and halal food products',
        products: ['1', '2', '6', '10'],
        sortOrder: 'best-selling',
        published: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'col-2',
        title: 'Islamic Books',
        handle: 'books',
        description: 'Educational and spiritual Islamic literature',
        products: ['3', '7', '11'],
        sortOrder: 'alpha-asc',
        published: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'col-3',
        title: 'Modest Fashion',
        handle: 'clothing',
        description: 'Elegant and modest Islamic clothing',
        products: ['4', '9'],
        sortOrder: 'price-asc',
        published: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'col-4',
        title: 'Home & Decor',
        handle: 'home-decor',
        description: 'Beautiful Islamic home decorations',
        products: ['5', '8'],
        sortOrder: 'manual',
        published: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'col-5',
        title: 'Featured Collection',
        handle: 'featured',
        description: 'Our top picks and bestsellers',
        products: ['1', '2', '3', '4', '5'],
        sortOrder: 'best-selling',
        published: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    collections.forEach(c => this.collections.set(c.id, c));

    // Seed discounts
    const discounts: Discount[] = [
      {
        id: 'disc-1',
        code: 'WELCOME10',
        type: 'percentage',
        value: 10,
        minPurchase: 50,
        usedCount: 0,
        startsAt: new Date().toISOString(),
        applicableTo: 'all',
        active: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'disc-2',
        code: 'RAMADAN20',
        type: 'percentage',
        value: 20,
        minPurchase: 100,
        maxUses: 500,
        usedCount: 123,
        startsAt: new Date().toISOString(),
        applicableTo: 'all',
        active: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'disc-3',
        code: 'FREESHIP',
        type: 'free_shipping',
        value: 0,
        minPurchase: 75,
        usedCount: 45,
        startsAt: new Date().toISOString(),
        applicableTo: 'all',
        active: true,
        createdAt: new Date().toISOString(),
      },
    ];

    discounts.forEach(d => this.discounts.set(d.id, d));

    // Seed shipping rates
    const shippingRates: ShippingRate[] = [
      {
        id: 'ship-1',
        name: 'Standard Shipping',
        price: 5.99,
        minDays: 5,
        maxDays: 7,
        active: true,
      },
      {
        id: 'ship-2',
        name: 'Express Shipping',
        price: 15.99,
        minDays: 2,
        maxDays: 3,
        active: true,
      },
      {
        id: 'ship-3',
        name: 'Free Shipping',
        price: 0,
        minOrder: 75,
        minDays: 7,
        maxDays: 10,
        active: true,
      },
    ];

    shippingRates.forEach(s => this.shippingRates.set(s.id, s));

    // Seed customers
    const customers: Customer[] = [
      {
        id: 'DEMO001',
        firstName: 'Demo',
        lastName: 'User',
        name: 'Demo User',
        email: 'demo@tansiqhub.com',
        phone: '+1 (555) 123-4567',
        role: 'customer',
        createdAt: '2025-12-15T00:00:00Z',
        orders: 3,
        totalOrders: 3,
        totalSpent: 287.50,
        addresses: [
          {
            id: 'addr-1',
            firstName: 'Demo',
            lastName: 'User',
            address1: '123 Main St',
            city: 'New York',
            province: 'NY',
            country: 'United States',
            zip: '10001',
            phone: '+1 (555) 123-4567',
            default: true,
          },
        ],
        tags: ['demo', 'vip'],
        acceptsMarketing: true,
      },
      {
        id: 'ADMIN001',
        firstName: 'Admin',
        lastName: 'User',
        name: 'Admin User',
        email: 'admin@tansiqhub.com',
        phone: '',
        role: 'admin',
        createdAt: '2025-01-01T00:00:00Z',
        addresses: [],
        tags: ['admin'],
        acceptsMarketing: false,
        totalOrders: 0,
        totalSpent: 0,
      },
    ];

    customers.forEach(c => this.customers.set(c.id, c));

    // Seed sample orders
    const orders: Order[] = [
      {
        id: 'ORD-001',
        orderNumber: 1001,
        email: 'demo@tansiqhub.com',
        customerId: 'DEMO001',
        items: [
          { id: 'line-1', productId: '1', title: sampleProducts[0].name, quantity: 2, price: sampleProducts[0].price, totalDiscount: 0, sku: 'SKU-000001' },
          { id: 'line-2', productId: '2', title: sampleProducts[1].name, quantity: 1, price: sampleProducts[1].price, totalDiscount: 0, sku: 'SKU-000002' },
        ],
        subtotal: 68.97,
        totalDiscount: 0,
        totalShipping: 5.99,
        totalTax: 5.52,
        total: 80.48,
        currency: 'USD',
        financialStatus: 'paid',
        fulfillmentStatus: 'fulfilled',
        status: 'delivered',
        shippingAddress: { firstName: 'Demo', lastName: 'User', address1: '123 Main St', city: 'New York', country: 'United States', zip: '10001' },
        billingAddress: { firstName: 'Demo', lastName: 'User', address1: '123 Main St', city: 'New York', country: 'United States', zip: '10001' },
        shippingMethod: 'Standard Shipping',
        paymentMethod: 'credit_card',
        tags: [],
        discountCodes: [],
        fulfillments: [],
        refunds: [],
        customer: {
          name: 'Demo User',
          email: 'demo@tansiqhub.com',
          phone: '+1 (555) 123-4567',
          address: '123 Main St',
          city: 'New York',
          country: 'United States',
        },
        createdAt: '2026-01-05T10:30:00Z',
        updatedAt: '2026-01-08T14:00:00Z',
      },
      {
        id: 'ORD-002',
        orderNumber: 1002,
        email: 'demo@tansiqhub.com',
        customerId: 'DEMO001',
        items: [
          { id: 'line-3', productId: '3', title: sampleProducts[2].name, quantity: 1, price: sampleProducts[2].price, totalDiscount: 0, sku: 'SKU-000003' },
        ],
        subtotal: 45.99,
        totalDiscount: 0,
        totalShipping: 5.99,
        totalTax: 3.68,
        total: 55.66,
        currency: 'USD',
        financialStatus: 'paid',
        fulfillmentStatus: 'partial',
        status: 'shipped',
        shippingAddress: { firstName: 'Demo', lastName: 'User', address1: '123 Main St', city: 'New York', country: 'United States', zip: '10001' },
        billingAddress: { firstName: 'Demo', lastName: 'User', address1: '123 Main St', city: 'New York', country: 'United States', zip: '10001' },
        shippingMethod: 'Standard Shipping',
        paymentMethod: 'credit_card',
        tags: [],
        discountCodes: [],
        fulfillments: [],
        refunds: [],
        customer: {
          name: 'Demo User',
          email: 'demo@tansiqhub.com',
          phone: '+1 (555) 123-4567',
          address: '123 Main St',
          city: 'New York',
          country: 'United States',
        },
        createdAt: '2026-01-10T15:45:00Z',
        updatedAt: '2026-01-11T09:00:00Z',
      },
    ];

    orders.forEach(o => this.orders.set(o.id, o));
  }

  // Product methods
  getProducts() { return Array.from(this.products.values()); }
  getProduct(id: string) { return this.products.get(id); }
  createProduct(product: Product) { this.products.set(product.id, product); return product; }
  updateProduct(id: string, updates: Partial<Product>) {
    const product = this.products.get(id);
    if (product) {
      const updated = { ...product, ...updates };
      this.products.set(id, updated);
      return updated;
    }
    return null;
  }
  deleteProduct(id: string) { return this.products.delete(id); }

  // Order methods
  getOrders() { return Array.from(this.orders.values()); }
  getOrder(id: string) { return this.orders.get(id); }
  createOrder(order: Order) { this.orders.set(order.id, order); return order; }
  updateOrder(id: string, updates: Partial<Order>) {
    const order = this.orders.get(id);
    if (order) {
      const updated = { ...order, ...updates, updatedAt: new Date().toISOString() };
      this.orders.set(id, updated);
      return updated;
    }
    return null;
  }

  // Customer methods
  getCustomers() { return Array.from(this.customers.values()); }
  getCustomer(id: string) { return this.customers.get(id); }
  getCustomerByEmail(email: string) { 
    return Array.from(this.customers.values()).find(c => c.email === email);
  }
  createCustomer(customer: Customer) { this.customers.set(customer.id, customer); return customer; }
  updateCustomer(id: string, updates: Partial<Customer>) {
    const customer = this.customers.get(id);
    if (customer) {
      const updated = { ...customer, ...updates };
      this.customers.set(id, updated);
      return updated;
    }
    return null;
  }

  // Collection methods
  getCollections() { return Array.from(this.collections.values()); }
  getCollection(id: string) { return this.collections.get(id); }
  getCollectionByHandle(handle: string) {
    return Array.from(this.collections.values()).find(c => c.handle === handle);
  }
  createCollection(collection: Collection) { this.collections.set(collection.id, collection); return collection; }
  updateCollection(id: string, updates: Partial<Collection>) {
    const collection = this.collections.get(id);
    if (collection) {
      const updated = { ...collection, ...updates, updatedAt: new Date().toISOString() };
      this.collections.set(id, updated);
      return updated;
    }
    return null;
  }
  deleteCollection(id: string) { return this.collections.delete(id); }

  // Discount methods
  getDiscounts() { return Array.from(this.discounts.values()); }
  getDiscount(id: string) { return this.discounts.get(id); }
  getDiscountByCode(code: string) {
    return Array.from(this.discounts.values()).find(d => d.code.toUpperCase() === code.toUpperCase());
  }
  createDiscount(discount: Discount) { this.discounts.set(discount.id, discount); return discount; }
  updateDiscount(id: string, updates: Partial<Discount>) {
    const discount = this.discounts.get(id);
    if (discount) {
      const updated = { ...discount, ...updates };
      this.discounts.set(id, updated);
      return updated;
    }
    return null;
  }
  deleteDiscount(id: string) { return this.discounts.delete(id); }

  // Inventory methods
  getInventory() { return Array.from(this.inventory.values()); }
  getInventoryItem(id: string) { 
    return Array.from(this.inventory.values()).find(i => i.id === id);
  }
  getInventoryByProduct(productId: string) { return this.inventory.get(productId); }
  updateInventory(id: string, updates: Partial<InventoryItem>) {
    // Find by inventory id
    const item = Array.from(this.inventory.values()).find(i => i.id === id);
    if (item) {
      const updated = { ...item, ...updates, updatedAt: new Date().toISOString() };
      this.inventory.set(item.productId, updated);
      return updated;
    }
    return null;
  }
  adjustInventory(productId: string, adjustment: number) {
    const item = this.inventory.get(productId);
    if (item) {
      item.quantity += adjustment;
      item.updatedAt = new Date().toISOString();
      return item;
    }
    return null;
  }

  // Cart methods
  getCarts() { return Array.from(this.carts.values()); }
  getCart(id: string) { return this.carts.get(id); }
  createCart(cart: Cart) { this.carts.set(cart.id, cart); return cart; }
  updateCart(id: string, updates: Partial<Cart>) {
    const cart = this.carts.get(id);
    if (cart) {
      const updated = { ...cart, ...updates, updatedAt: new Date().toISOString() };
      this.carts.set(id, updated);
      return updated;
    }
    return null;
  }
  deleteCart(id: string) { return this.carts.delete(id); }

  // Shipping methods
  getShippingRates() { return Array.from(this.shippingRates.values()); }
  getShippingRate(id: string) { return this.shippingRates.get(id); }
  createShippingRate(rate: ShippingRate) { this.shippingRates.set(rate.id, rate); return rate; }
  updateShippingRate(id: string, updates: Partial<ShippingRate>) {
    const rate = this.shippingRates.get(id);
    if (rate) {
      const updated = { ...rate, ...updates };
      this.shippingRates.set(id, updated);
      return updated;
    }
    return null;
  }
  deleteShippingRate(id: string) { return this.shippingRates.delete(id); }
  deleteCustomer(id: string) { return this.customers.delete(id); }

  // Webhook methods
  getWebhooks() { return Array.from(this.webhooks.values()); }
  getWebhook(id: string) { return this.webhooks.get(id); }
  createWebhook(webhook: Webhook) { this.webhooks.set(webhook.id, webhook); return webhook; }
  updateWebhook(id: string, updates: Partial<Webhook>) {
    const webhook = this.webhooks.get(id);
    if (webhook) {
      const updated = { ...webhook, ...updates };
      this.webhooks.set(id, updated);
      return updated;
    }
    return null;
  }
  deleteWebhook(id: string) { return this.webhooks.delete(id); }

  // Cart methods - additional
  getCartByToken(token: string) {
    return Array.from(this.carts.values()).find(c => c.token === token);
  }

  // Store settings
  getStoreSettings() { return this.storeSettings; }
  updateStoreSettings(updates: Partial<StoreSettings>) {
    this.storeSettings = { ...this.storeSettings, ...updates };
    return this.storeSettings;
  }
}

// Export singleton instance
export const db = new Database();
