// Single Shipping Rate API
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from '@/lib/api/helpers';

// GET /api/shipping/[id] - Get single shipping rate
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rate = db.getShippingRate(id);

    if (!rate) {
      return notFoundResponse('Shipping rate');
    }

    return successResponse({
      shipping_rate: {
        id: rate.id,
        name: rate.name,
        price: rate.price,
        min_order: rate.minOrder || null,
        max_order: rate.maxOrder || null,
        estimated_days: `${rate.minDays}-${rate.maxDays} business days`,
        min_days: rate.minDays,
        max_days: rate.maxDays,
        countries: rate.countries || [],
        active: rate.active !== false,
      },
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to fetch shipping rate', 500);
  }
}

// PUT /api/shipping/[id] - Update shipping rate
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = db.getShippingRate(id);
    if (!existing) {
      return notFoundResponse('Shipping rate');
    }

    const updates: Record<string, unknown> = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.price !== undefined) updates.price = parseFloat(body.price);
    if (body.min_order !== undefined) updates.minOrder = body.min_order ? parseFloat(body.min_order) : undefined;
    if (body.max_order !== undefined) updates.maxOrder = body.max_order ? parseFloat(body.max_order) : undefined;
    if (body.min_days !== undefined) updates.minDays = parseInt(body.min_days);
    if (body.max_days !== undefined) updates.maxDays = parseInt(body.max_days);
    if (body.countries !== undefined) updates.countries = body.countries;
    if (body.active !== undefined) updates.active = body.active;

    const updated = db.updateShippingRate(id, updates);

    return successResponse({
      shipping_rate: {
        id: updated!.id,
        name: updated!.name,
        price: updated!.price,
        min_order: updated!.minOrder || null,
        max_order: updated!.maxOrder || null,
        estimated_days: `${updated!.minDays}-${updated!.maxDays} business days`,
        countries: updated!.countries || [],
        active: updated!.active !== false,
      },
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to update shipping rate', 500);
  }
}

// DELETE /api/shipping/[id] - Delete shipping rate
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = db.getShippingRate(id);

    if (!existing) {
      return notFoundResponse('Shipping rate');
    }

    db.deleteShippingRate(id);

    return successResponse({ deleted: true, id });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to delete shipping rate', 500);
  }
}
