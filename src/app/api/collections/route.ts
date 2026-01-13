// Collections API - Shopify-like Collection Management
import { NextRequest } from 'next/server';
import { db, Collection } from '@/lib/db';
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

// GET /api/collections - List all collections
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const { page, limit, sort, order } = parseQueryParams(url);
    const handle = url.searchParams.get('handle');
    const ids = url.searchParams.get('ids')?.split(',');
    const publishedStatus = url.searchParams.get('published_status');

    let collections = db.getCollections();

    // Filter by handle
    if (handle) {
      const collection = db.getCollectionByHandle(handle);
      if (collection) {
        return successResponse({ collection: formatCollection(collection) });
      }
      return notFoundResponse('Collection');
    }

    // Filter by IDs
    if (ids && ids.length > 0) {
      collections = collections.filter(c => ids.includes(c.id));
    }

    // Filter by published status
    if (publishedStatus === 'published') {
      collections = collections.filter(c => c.published);
    } else if (publishedStatus === 'unpublished') {
      collections = collections.filter(c => !c.published);
    }

    // Sort
    collections.sort((a, b) => {
      let comparison = 0;
      switch (sort) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'products_count':
          comparison = a.products.length - b.products.length;
          break;
        case 'created_at':
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return order === 'desc' ? -comparison : comparison;
    });

    // Paginate
    const { items, meta } = paginate(collections, page, limit);

    return successResponse({
      collections: items.map(formatCollection),
    }, meta);
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to fetch collections', 500);
  }
}

// POST /api/collections - Create a new collection
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const validationErrors = validateRequired(body, ['title']);
    if (validationErrors) {
      return validationError(validationErrors);
    }

    // Generate handle from title
    const handle = body.handle || body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if handle already exists
    const existing = db.getCollectionByHandle(handle);
    if (existing) {
      return errorResponse('DUPLICATE_ERROR', 'A collection with this handle already exists', 422);
    }

    const collection: Collection = {
      id: generateId('col'),
      title: body.title,
      handle,
      description: body.body_html || body.description || '',
      image: body.image?.src,
      products: body.products || [],
      sortOrder: body.sort_order || 'manual',
      published: body.published !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const created = db.createCollection(collection);

    return successResponse({ collection: formatCollection(created) });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to create collection', 500);
  }
}

// Helper function to format collection for API response
function formatCollection(c: Collection) {
  return {
    id: c.id,
    handle: c.handle,
    title: c.title,
    body_html: c.description,
    published_at: c.published ? c.createdAt : null,
    sort_order: c.sortOrder,
    image: c.image ? { src: c.image } : null,
    products_count: c.products.length,
    created_at: c.createdAt,
    updated_at: c.updatedAt,
  };
}
