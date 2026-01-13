// Shop/Store Settings API - Shopify-like Store Configuration
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import {
  successResponse,
  errorResponse,
} from '@/lib/api/helpers';

// GET /api/shop - Get store information
export async function GET() {
  try {
    const settings = db.getStoreSettings();
    const products = db.getProducts();
    const orders = db.getOrders();
    const customers = db.getCustomers();

    return successResponse({
      shop: {
        id: settings.id,
        name: settings.name,
        email: settings.email,
        phone: settings.phone,
        domain: settings.domain,
        address: settings.address,
        currency: settings.currency,
        timezone: settings.timezone,
        weight_unit: settings.weightUnit,
        taxes_included: settings.taxesIncluded,
        tax_shipping: settings.taxShipping,
        plan_name: 'Professional',
        created_at: settings.createdAt,
        
        // Store statistics
        stats: {
          products_count: products.length,
          orders_count: orders.length,
          customers_count: customers.length,
          total_revenue: orders.reduce((sum, o) => sum + o.total, 0),
        },
        
        // Branding
        branding: {
          primary_color: '#1a5f4a',
          secondary_color: '#d4af37',
          logo: '/logo.png',
          favicon: '/favicon.ico',
        },
        
        // Social links
        social: {
          facebook: 'https://facebook.com/tansiqhub',
          instagram: 'https://instagram.com/tansiqhub',
          twitter: 'https://twitter.com/tansiqhub',
        },
        
        // Features
        features: {
          checkout_enabled: true,
          guest_checkout: true,
          accounts_required: false,
          multi_currency: false,
          inventory_tracking: true,
          reviews_enabled: true,
        },
      },
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to fetch shop info', 500);
  }
}

// PUT /api/shop - Update store settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const settings = db.getStoreSettings();

    const updates: Record<string, unknown> = {};

    // Basic info
    if (body.name !== undefined) updates.name = body.name;
    if (body.email !== undefined) updates.email = body.email;
    if (body.phone !== undefined) updates.phone = body.phone;
    if (body.domain !== undefined) updates.domain = body.domain;

    // Address
    if (body.address !== undefined) updates.address = body.address;

    // Settings
    if (body.currency !== undefined) updates.currency = body.currency;
    if (body.timezone !== undefined) updates.timezone = body.timezone;
    if (body.weight_unit !== undefined) updates.weightUnit = body.weight_unit;
    if (body.taxes_included !== undefined) updates.taxesIncluded = body.taxes_included;
    if (body.tax_shipping !== undefined) updates.taxShipping = body.tax_shipping;

    const updated = db.updateStoreSettings(updates);

    return successResponse({
      shop: {
        id: updated!.id,
        name: updated!.name,
        email: updated!.email,
        phone: updated!.phone,
        domain: updated!.domain,
        currency: updated!.currency,
        timezone: updated!.timezone,
      },
      message: 'Store settings updated',
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to update shop settings', 500);
  }
}
