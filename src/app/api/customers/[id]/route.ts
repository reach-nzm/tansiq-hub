// Single Customer API - GET, PUT, DELETE
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import {
  successResponse,
  notFoundResponse,
  errorResponse,
} from '@/lib/api/helpers';

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/customers/[id] - Get a single customer
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const customer = db.getCustomer(id);

    if (!customer) {
      return notFoundResponse('Customer');
    }

    // Get customer orders
    const orders = db.getOrders().filter(o => o.customer.email === customer.email);

    return successResponse({
      customer: {
        id: customer.id,
        email: customer.email,
        first_name: customer.name.split(' ')[0],
        last_name: customer.name.split(' ').slice(1).join(' ') || '',
        phone: customer.phone || null,
        created_at: customer.createdAt,
        orders_count: customer.ordersCount || orders.length,
        total_spent: (customer.totalSpent || orders.reduce((sum, o) => sum + o.total, 0)).toFixed(2),
        last_order_id: customer.lastOrderId || (orders.length > 0 ? orders[orders.length - 1].id : null),
        tags: customer.tags.join(', '),
        tax_exempt: customer.taxExempt,
        accepts_marketing: customer.acceptsMarketing,
        note: customer.note || null,
        verified_email: true,
        state: 'enabled',
        addresses: customer.addresses.map(addr => ({
          id: addr.id,
          customer_id: customer.id,
          first_name: addr.firstName,
          last_name: addr.lastName,
          company: addr.company || null,
          address1: addr.address1,
          address2: addr.address2 || null,
          city: addr.city,
          province: addr.province,
          country: addr.country,
          zip: addr.zip,
          phone: addr.phone || null,
          default: addr.default,
        })),
        default_address: customer.addresses.find(a => a.default) || null,
        orders: orders.map(o => ({
          id: o.id,
          total_price: o.total.toFixed(2),
          created_at: o.createdAt,
          status: o.status,
        })),
      },
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to fetch customer', 500);
  }
}

// PUT /api/customers/[id] - Update a customer
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = db.getCustomer(id);
    if (!existing) {
      return notFoundResponse('Customer');
    }

    const updates: Record<string, unknown> = {};

    // Update name
    if (body.first_name !== undefined || body.last_name !== undefined) {
      const firstName = body.first_name ?? existing.name.split(' ')[0];
      const lastName = body.last_name ?? existing.name.split(' ').slice(1).join(' ');
      updates.name = `${firstName} ${lastName}`.trim();
    }

    // Update other fields
    if (body.email !== undefined) updates.email = body.email.toLowerCase();
    if (body.phone !== undefined) updates.phone = body.phone;
    if (body.note !== undefined) updates.note = body.note;
    if (body.tax_exempt !== undefined) updates.taxExempt = body.tax_exempt;
    if (body.accepts_marketing !== undefined) updates.acceptsMarketing = body.accepts_marketing;
    if (body.tags !== undefined) {
      updates.tags = typeof body.tags === 'string' 
        ? body.tags.split(',').map((t: string) => t.trim())
        : body.tags;
    }

    const updated = db.updateCustomer(id, updates);

    return successResponse({
      customer: {
        id: updated?.id,
        email: updated?.email,
        first_name: updated?.name.split(' ')[0],
        last_name: updated?.name.split(' ').slice(1).join(' '),
      },
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to update customer', 500);
  }
}

// DELETE /api/customers/[id] - Delete a customer
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const existing = db.getCustomer(id);
    if (!existing) {
      return notFoundResponse('Customer');
    }

    // Don't allow deleting admin
    if (existing.role === 'admin') {
      return errorResponse('FORBIDDEN', 'Cannot delete admin users', 403);
    }

    // In Shopify-style, we might want to anonymize instead of delete
    // For now, we'll just delete
    db.updateCustomer(id, {
      email: `deleted-${id}@deleted.com`,
      name: 'Deleted Customer',
      phone: undefined,
      addresses: [],
    });

    return successResponse({ deleted: true, id });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to delete customer', 500);
  }
}
