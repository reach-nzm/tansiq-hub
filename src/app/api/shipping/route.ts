// Shipping Rates API
import { NextRequest } from 'next/server';
import { db, ShippingRate } from '@/lib/db';
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  validationError,
  generateId,
  validateRequired,
} from '@/lib/api/helpers';

// GET /api/shipping - List shipping rates
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const active = url.searchParams.get('active');
    const countryCode = url.searchParams.get('country');
    const subtotal = url.searchParams.get('subtotal');

    let rates = db.getShippingRates();

    // Filter active rates
    if (active === 'true') {
      rates = rates.filter(r => r.active !== false);
    }

    // Filter by country
    if (countryCode) {
      rates = rates.filter(r => 
        !r.countries || r.countries.length === 0 || r.countries.includes(countryCode)
      );
    }

    // Filter by minimum order
    if (subtotal) {
      const amount = parseFloat(subtotal);
      rates = rates.filter(r => !r.minOrder || amount >= r.minOrder);
    }

    return successResponse({
      shipping_rates: rates.map(r => formatShippingRate(r)),
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to fetch shipping rates', 500);
  }
}

// POST /api/shipping - Create shipping rate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationErrors = validateRequired(body, ['name', 'price']);
    if (validationErrors) {
      return validationError(validationErrors);
    }

    const rate: ShippingRate = {
      id: generateId('ship'),
      name: body.name,
      price: parseFloat(body.price),
      minOrder: body.min_order ? parseFloat(body.min_order) : undefined,
      maxOrder: body.max_order ? parseFloat(body.max_order) : undefined,
      minDays: body.min_days || 3,
      maxDays: body.max_days || 7,
      countries: body.countries || [],
      active: body.active !== false,
    };

    const created = db.createShippingRate(rate);

    return successResponse({
      shipping_rate: formatShippingRate(created),
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to create shipping rate', 500);
  }
}

function formatShippingRate(r: ShippingRate) {
  return {
    id: r.id,
    name: r.name,
    price: r.price,
    min_order: r.minOrder || null,
    max_order: r.maxOrder || null,
    estimated_days: `${r.minDays}-${r.maxDays} business days`,
    min_days: r.minDays,
    max_days: r.maxDays,
    countries: r.countries || [],
    active: r.active !== false,
  };
}
