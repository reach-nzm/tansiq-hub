// Single Product API - GET, PUT, DELETE
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import {
  successResponse,
  notFoundResponse,
  validationError,
  errorResponse,
  validateRequired,
} from '@/lib/api/helpers';

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/products/[id] - Get a single product
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const product = db.getProduct(id);

    if (!product) {
      return notFoundResponse('Product');
    }

    // Get inventory info
    const inventory = db.getInventoryItem(id);

    return successResponse({
      product: {
        ...product,
        inventory: inventory ? {
          sku: inventory.sku,
          available: inventory.availableQuantity,
          tracked: inventory.trackInventory,
        } : null,
      },
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to fetch product', 500);
  }
}

// PUT /api/products/[id] - Update a product
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = db.getProduct(id);
    if (!existing) {
      return notFoundResponse('Product');
    }

    const updates: Record<string, unknown> = {};

    // Only update provided fields
    if (body.name !== undefined) updates.name = body.name;
    if (body.name_arabic !== undefined) updates.nameArabic = body.name_arabic;
    if (body.description !== undefined) updates.description = body.description;
    if (body.price !== undefined) updates.price = parseFloat(body.price);
    if (body.original_price !== undefined) updates.originalPrice = parseFloat(body.original_price);
    if (body.category !== undefined) updates.category = body.category;
    if (body.subcategory !== undefined) updates.subcategory = body.subcategory;
    if (body.image !== undefined) updates.image = body.image;
    if (body.images !== undefined) updates.images = body.images;
    if (body.stock !== undefined) updates.stock = parseInt(body.stock);
    if (body.tags !== undefined) updates.tags = body.tags;
    if (body.featured !== undefined) updates.featured = body.featured;
    if (body.is_new !== undefined) updates.isNew = body.is_new;
    if (body.is_bestseller !== undefined) updates.isBestseller = body.is_bestseller;

    const updated = db.updateProduct(id, updates);

    // Update inventory if stock changed
    if (body.stock !== undefined) {
      db.updateInventory(id, {
        quantity: parseInt(body.stock),
        availableQuantity: parseInt(body.stock),
      });
    }

    return successResponse({ product: updated });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to update product', 500);
  }
}

// DELETE /api/products/[id] - Delete a product
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const existing = db.getProduct(id);
    if (!existing) {
      return notFoundResponse('Product');
    }

    db.deleteProduct(id);

    return successResponse({ deleted: true, id });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to delete product', 500);
  }
}
