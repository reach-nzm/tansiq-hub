// Single Collection API - GET, PUT, DELETE
import { NextRequest } from 'next/server';
import { db, Collection } from '@/lib/db';
import {
  successResponse,
  notFoundResponse,
  errorResponse,
} from '@/lib/api/helpers';

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/collections/[id] - Get a single collection
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const collection = db.getCollection(id);

    if (!collection) {
      return notFoundResponse('Collection');
    }

    // Get products in collection
    const products = collection.products
      .map(pid => db.getProduct(pid))
      .filter(Boolean);

    return successResponse({
      collection: {
        id: collection.id,
        handle: collection.handle,
        title: collection.title,
        body_html: collection.description,
        published_at: collection.published ? collection.createdAt : null,
        sort_order: collection.sortOrder,
        image: collection.image ? { src: collection.image } : null,
        products_count: collection.products.length,
        created_at: collection.createdAt,
        updated_at: collection.updatedAt,
        products: products.map(p => ({
          id: p!.id,
          title: p!.name,
          handle: p!.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          price: p!.price.toFixed(2),
          image: p!.image,
        })),
      },
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to fetch collection', 500);
  }
}

// PUT /api/collections/[id] - Update a collection
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = db.getCollection(id);
    if (!existing) {
      return notFoundResponse('Collection');
    }

    const updates: Partial<Collection> = {};

    if (body.title !== undefined) updates.title = body.title;
    if (body.handle !== undefined) updates.handle = body.handle;
    if (body.body_html !== undefined) updates.description = body.body_html;
    if (body.description !== undefined) updates.description = body.description;
    if (body.image !== undefined) updates.image = body.image?.src || body.image;
    if (body.products !== undefined) updates.products = body.products;
    if (body.sort_order !== undefined) updates.sortOrder = body.sort_order;
    if (body.published !== undefined) updates.published = body.published;

    const updated = db.updateCollection(id, updates);

    return successResponse({
      collection: {
        id: updated?.id,
        handle: updated?.handle,
        title: updated?.title,
        updated_at: updated?.updatedAt,
      },
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to update collection', 500);
  }
}

// DELETE /api/collections/[id] - Delete a collection
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const existing = db.getCollection(id);
    if (!existing) {
      return notFoundResponse('Collection');
    }

    db.deleteCollection(id);

    return successResponse({ deleted: true, id });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to delete collection', 500);
  }
}
