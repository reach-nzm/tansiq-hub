// Products API - Shopify-like Product Management
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  validationError,
  paginate,
  generateId,
  parseQueryParams,
  validateRequired,
} from '@/lib/api/helpers';
import { Product } from '@/store/useStore';

// GET /api/products - List all products
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const { page, limit, sort, order, search, category } = parseQueryParams(url);
    const ids = url.searchParams.get('ids')?.split(',');
    const collection = url.searchParams.get('collection_id');
    const featured = url.searchParams.get('featured');
    const minPrice = parseFloat(url.searchParams.get('min_price') || '0');
    const maxPrice = parseFloat(url.searchParams.get('max_price') || '999999');

    let products = db.getProducts();

    // Filter by IDs
    if (ids && ids.length > 0) {
      products = products.filter(p => ids.includes(p.id));
    }

    // Filter by collection
    if (collection) {
      const col = db.getCollection(collection);
      if (col) {
        products = products.filter(p => col.products.includes(p.id));
      }
    }

    // Filter by category
    if (category) {
      products = products.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by featured
    if (featured === 'true') {
      products = products.filter(p => p.featured);
    }

    // Filter by price range
    products = products.filter(p => p.price >= minPrice && p.price <= maxPrice);

    // Search
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags?.some(t => t.toLowerCase().includes(searchLower))
      );
    }

    // Sort
    products.sort((a, b) => {
      let comparison = 0;
      switch (sort) {
        case 'name':
        case 'title':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'stock':
          comparison = a.stock - b.stock;
          break;
        default:
          comparison = 0;
      }
      return order === 'desc' ? -comparison : comparison;
    });

    // Paginate
    const { items, meta } = paginate(products, page, limit);

    return successResponse({ products: items }, meta);
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to fetch products', 500);
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const validationErrors = validateRequired(body, ['name', 'price', 'category']);
    if (validationErrors) {
      return validationError(validationErrors);
    }

    const product: Product = {
      id: generateId('prod'),
      name: body.name,
      nameArabic: body.name_arabic,
      description: body.description || '',
      price: parseFloat(body.price),
      originalPrice: body.original_price ? parseFloat(body.original_price) : undefined,
      category: body.category,
      subcategory: body.subcategory,
      image: body.image || 'https://via.placeholder.com/500',
      images: body.images || [],
      stock: parseInt(body.stock) || 0,
      rating: 0,
      reviews: 0,
      tags: body.tags || [],
      featured: body.featured || false,
      isNew: true,
      isBestseller: false,
    };

    const created = db.createProduct(product);

    // Also create inventory item
    db.updateInventory(product.id, {
      productId: product.id,
      sku: body.sku || `SKU-${product.id}`,
      quantity: product.stock,
      reservedQuantity: 0,
      availableQuantity: product.stock,
      lowStockThreshold: body.low_stock_threshold || 10,
      trackInventory: body.track_inventory !== false,
      allowBackorder: body.allow_backorder || false,
      updatedAt: new Date().toISOString(),
    });

    return successResponse({ product: created });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to create product', 500);
  }
}
