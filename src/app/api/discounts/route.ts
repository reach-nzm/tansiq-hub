// Discounts API - Shopify-like Discount Management
import { NextRequest } from 'next/server';
import { db, Discount } from '@/lib/db';
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

// GET /api/discounts - List all discounts
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const { page, limit, sort, order } = parseQueryParams(url);
    const code = url.searchParams.get('code');

    let discounts = db.getDiscounts();

    // Filter by code
    if (code) {
      const discount = db.getDiscountByCode(code);
      if (discount) {
        return successResponse({ discount: formatDiscount(discount) });
      }
      return notFoundResponse('Discount');
    }

    // Sort
    discounts.sort((a, b) => {
      const comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return order === 'desc' ? -comparison : comparison;
    });

    // Paginate
    const { items, meta } = paginate(discounts, page, limit);

    return successResponse({
      discounts: items.map(formatDiscount),
    }, meta);
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to fetch discounts', 500);
  }
}

// POST /api/discounts - Create a new discount
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const validationErrors = validateRequired(body, ['code', 'type', 'value']);
    if (validationErrors) {
      return validationError(validationErrors);
    }

    // Validate discount type
    const validTypes = ['percentage', 'fixed_amount', 'free_shipping'];
    if (!validTypes.includes(body.type)) {
      return validationError({ type: ['Invalid discount type'] });
    }

    // Check if code already exists
    const existing = db.getDiscountByCode(body.code);
    if (existing) {
      return errorResponse('DUPLICATE_ERROR', 'A discount with this code already exists', 422);
    }

    const discount: Discount = {
      id: generateId('disc'),
      code: body.code.toUpperCase(),
      type: body.type,
      value: parseFloat(body.value),
      minPurchase: body.min_purchase ? parseFloat(body.min_purchase) : undefined,
      maxUses: body.max_uses ? parseInt(body.max_uses) : undefined,
      usedCount: 0,
      startsAt: body.starts_at || new Date().toISOString(),
      endsAt: body.ends_at,
      applicableTo: body.applicable_to || 'all',
      productIds: body.product_ids,
      collectionIds: body.collection_ids,
      active: body.active !== false,
      createdAt: new Date().toISOString(),
    };

    const created = db.createDiscount(discount);

    return successResponse({ discount: formatDiscount(created) });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to create discount', 500);
  }
}

// Helper function to format discount for API response
function formatDiscount(d: Discount) {
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
