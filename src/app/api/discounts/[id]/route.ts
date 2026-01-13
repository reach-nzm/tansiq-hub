// Single Discount API - Shopify-like Discount Management
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from '@/lib/api/helpers';

// GET /api/discounts/[id] - Get a single discount
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const discount = db.getDiscount(id);

    if (!discount) {
      return notFoundResponse('Discount');
    }

    return successResponse({
      discount: formatDiscount(discount),
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to fetch discount', 500);
  }
}

// PUT /api/discounts/[id] - Update a discount
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = db.getDiscount(id);
    if (!existing) {
      return notFoundResponse('Discount');
    }

    const updates: Record<string, unknown> = {};

    if (body.code !== undefined) updates.code = body.code.toUpperCase();
    if (body.type !== undefined) updates.type = body.type;
    if (body.value !== undefined) updates.value = parseFloat(body.value);
    if (body.min_purchase !== undefined) updates.minPurchase = parseFloat(body.min_purchase);
    if (body.max_uses !== undefined) updates.maxUses = parseInt(body.max_uses);
    if (body.starts_at !== undefined) updates.startsAt = body.starts_at;
    if (body.ends_at !== undefined) updates.endsAt = body.ends_at;
    if (body.applicable_to !== undefined) updates.applicableTo = body.applicable_to;
    if (body.product_ids !== undefined) updates.productIds = body.product_ids;
    if (body.collection_ids !== undefined) updates.collectionIds = body.collection_ids;
    if (body.active !== undefined) updates.active = body.active;

    const updated = db.updateDiscount(id, updates);

    return successResponse({
      discount: formatDiscount(updated!),
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to update discount', 500);
  }
}

// DELETE /api/discounts/[id] - Delete a discount
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = db.getDiscount(id);

    if (!existing) {
      return notFoundResponse('Discount');
    }

    db.deleteDiscount(id);

    return successResponse({ deleted: true, id });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to delete discount', 500);
  }
}

// POST /api/discounts/[id] - Validate/Apply discount
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    if (action === 'validate') {
      const body = await request.json();
      const discount = db.getDiscount(id);

      if (!discount) {
        return errorResponse('INVALID_DISCOUNT', 'Discount code not found', 404);
      }

      // Check if active
      if (!discount.active) {
        return errorResponse('DISCOUNT_EXPIRED', 'This discount code is no longer active', 422);
      }

      // Check dates
      const now = new Date();
      if (discount.startsAt && new Date(discount.startsAt) > now) {
        return errorResponse('DISCOUNT_NOT_STARTED', 'This discount code is not yet active', 422);
      }
      if (discount.endsAt && new Date(discount.endsAt) < now) {
        return errorResponse('DISCOUNT_EXPIRED', 'This discount code has expired', 422);
      }

      // Check usage limit
      if (discount.maxUses && discount.usedCount >= discount.maxUses) {
        return errorResponse('DISCOUNT_LIMIT_REACHED', 'This discount code has reached its usage limit', 422);
      }

      // Check minimum purchase
      const subtotal = body.subtotal || 0;
      if (discount.minPurchase && subtotal < discount.minPurchase) {
        return errorResponse(
          'MINIMUM_NOT_MET',
          `Minimum purchase of $${discount.minPurchase.toFixed(2)} required`,
          422
        );
      }

      // Calculate discount amount
      let discountAmount = 0;
      if (discount.type === 'percentage') {
        discountAmount = subtotal * (discount.value / 100);
      } else if (discount.type === 'fixed_amount') {
        discountAmount = Math.min(discount.value, subtotal);
      } else if (discount.type === 'free_shipping') {
        discountAmount = body.shipping_cost || 0;
      }

      return successResponse({
        valid: true,
        discount: formatDiscount(discount),
        discount_amount: discountAmount,
        message: 'Discount code is valid',
      });
    }

    if (action === 'increment-usage') {
      const discount = db.getDiscount(id);
      if (!discount) {
        return notFoundResponse('Discount');
      }

      const updated = db.updateDiscount(id, {
        usedCount: discount.usedCount + 1,
      });

      return successResponse({
        discount: formatDiscount(updated!),
      });
    }

    return errorResponse('INVALID_ACTION', 'Invalid action specified', 400);
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to process discount action', 500);
  }
}

// Helper function to format discount for API response
function formatDiscount(d: any) {
  return {
    id: d.id,
    code: d.code,
    type: d.type,
    value: d.value,
    value_type: d.type === 'percentage' ? 'percentage' : 'fixed_amount',
    target_type: d.applicableTo === 'all' ? 'line_item' : d.applicableTo === 'specific_products' ? 'line_item' : 'shipping_line',
    minimum_requirement: d.minPurchase ? {
      type: 'subtotal',
      value: d.minPurchase,
    } : null,
    usage_limit: d.maxUses || null,
    usage_count: d.usedCount,
    starts_at: d.startsAt,
    ends_at: d.endsAt || null,
    status: d.active ? 'active' : 'expired',
    created_at: d.createdAt,
  };
}
