// Search API - Shopify-like Search
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import {
  successResponse,
  errorResponse,
  paginate,
  parseQueryParams,
} from '@/lib/api/helpers';

// GET /api/search - Search across products, collections, and pages
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const { page, limit } = parseQueryParams(url);
    const query = url.searchParams.get('q') || url.searchParams.get('query');
    const type = url.searchParams.get('type'); // products, collections, all

    if (!query || query.trim().length === 0) {
      return errorResponse('MISSING_QUERY', 'Search query is required', 400);
    }

    const searchTerm = query.toLowerCase().trim();
    const results: any[] = [];

    // Search products
    if (!type || type === 'products' || type === 'all') {
      const products = db.getProducts();
      const matchedProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description?.toLowerCase().includes(searchTerm) ||
        p.category?.toLowerCase().includes(searchTerm) ||
        p.tags?.some(t => t.toLowerCase().includes(searchTerm))
      );

      matchedProducts.forEach(p => {
        const handle = p.handle || p.name.toLowerCase().replace(/\s+/g, '-');
        results.push({
          type: 'product',
          id: p.id,
          title: p.name,
          handle: handle,
          description: p.description?.substring(0, 150) + '...',
          url: `/products/${handle}`,
          image: p.images?.[0] || p.image,
          price: p.price,
          compare_at_price: p.compareAtPrice || p.originalPrice,
        });
      });
    }

    // Search collections
    if (!type || type === 'collections' || type === 'all') {
      const collections = db.getCollections();
      const matchedCollections = collections.filter(c =>
        c.title.toLowerCase().includes(searchTerm) ||
        c.description?.toLowerCase().includes(searchTerm)
      );

      matchedCollections.forEach(c => {
        results.push({
          type: 'collection',
          id: c.id,
          title: c.title,
          handle: c.handle,
          description: c.description?.substring(0, 150) + '...',
          url: `/collections/${c.handle}`,
          image: c.image,
          products_count: c.productIds?.length || 0,
        });
      });
    }

    // Paginate results
    const { items, meta } = paginate(results, page, limit);

    return successResponse({
      query: query,
      results: items,
      result_counts: {
        products: results.filter(r => r.type === 'product').length,
        collections: results.filter(r => r.type === 'collection').length,
        total: results.length,
      },
    }, meta);
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Search failed', 500);
  }
}

// POST /api/search - Predictive search (autocomplete)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, limit = 5 } = body;

    if (!query || query.trim().length < 2) {
      return successResponse({ suggestions: [] });
    }

    const searchTerm = query.toLowerCase().trim();
    const suggestions: any[] = [];

    // Get product suggestions
    const products = db.getProducts();
    const matchedProducts = products
      .filter(p => p.name.toLowerCase().includes(searchTerm))
      .slice(0, limit);

    matchedProducts.forEach(p => {
      const handle = p.handle || p.name.toLowerCase().replace(/\s+/g, '-');
      suggestions.push({
        type: 'product',
        id: p.id,
        title: p.name,
        url: `/products/${handle}`,
        image: p.images?.[0] || p.image,
        price: p.price,
      });
    });

    // Get collection suggestions
    const collections = db.getCollections();
    const matchedCollections = collections
      .filter(c => c.title.toLowerCase().includes(searchTerm))
      .slice(0, 3);

    matchedCollections.forEach(c => {
      suggestions.push({
        type: 'collection',
        id: c.id,
        title: c.title,
        url: `/collections/${c.handle}`,
        image: c.image,
      });
    });

    // Get search term suggestions based on categories/tags
    const allTags = [...new Set(products.flatMap(p => p.tags || []))];
    const matchedTags = allTags
      .filter(t => t.toLowerCase().includes(searchTerm))
      .slice(0, 3);

    matchedTags.forEach(tag => {
      suggestions.push({
        type: 'query',
        title: tag,
        url: `/search?q=${encodeURIComponent(tag)}`,
      });
    });

    return successResponse({
      query,
      suggestions: suggestions.slice(0, limit + 5),
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Predictive search failed', 500);
  }
}
