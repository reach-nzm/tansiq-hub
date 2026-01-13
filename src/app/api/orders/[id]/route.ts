// Single Order API - GET, PUT
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

// GET /api/orders/[id] - Get a single order
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const order = db.getOrder(id);

    if (!order) {
      return notFoundResponse('Order');
    }

    return successResponse({
      order: {
        id: order.id,
        order_number: order.id.replace('ORD-', ''),
        email: order.customer.email,
        created_at: order.createdAt,
        updated_at: order.updatedAt,
        closed_at: order.status === 'delivered' ? order.updatedAt : null,
        cancelled_at: order.status === 'cancelled' ? order.updatedAt : null,
        total_price: order.total.toFixed(2),
        subtotal_price: order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2),
        total_tax: (order.total * 0.08).toFixed(2),
        total_discounts: '0.00',
        currency: 'USD',
        financial_status: 'paid',
        fulfillment_status: order.status === 'delivered' ? 'fulfilled' : order.status === 'shipped' ? 'partial' : null,
        name: `#${order.id.replace('ORD-', '')}`,
        note: null,
        line_items: order.items.map((item, index) => ({
          id: `li-${index}`,
          product_id: item.id,
          variant_id: item.id,
          title: item.name,
          quantity: item.quantity,
          price: item.price.toFixed(2),
          sku: `SKU-${item.id.padStart(6, '0')}`,
          fulfillable_quantity: order.status === 'pending' ? item.quantity : 0,
          fulfillment_status: order.status === 'delivered' ? 'fulfilled' : null,
        })),
        customer: {
          id: order.customer.email,
          email: order.customer.email,
          first_name: order.customer.name.split(' ')[0],
          last_name: order.customer.name.split(' ').slice(1).join(' '),
          phone: order.customer.phone,
          orders_count: 1,
          total_spent: order.total.toFixed(2),
        },
        billing_address: {
          first_name: order.customer.name.split(' ')[0],
          last_name: order.customer.name.split(' ').slice(1).join(' '),
          address1: order.customer.address,
          city: order.customer.city,
          country: order.customer.country,
          phone: order.customer.phone,
        },
        shipping_address: {
          first_name: order.customer.name.split(' ')[0],
          last_name: order.customer.name.split(' ').slice(1).join(' '),
          address1: order.customer.address,
          city: order.customer.city,
          country: order.customer.country,
          phone: order.customer.phone,
        },
        fulfillments: order.status === 'shipped' || order.status === 'delivered' ? [{
          id: `ful-${order.id}`,
          order_id: order.id,
          status: order.status === 'delivered' ? 'success' : 'pending',
          created_at: order.updatedAt,
          tracking_number: null,
          tracking_url: null,
        }] : [],
        refunds: [],
        status: order.status,
      },
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to fetch order', 500);
  }
}

// PUT /api/orders/[id] - Update an order
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = db.getOrder(id);
    if (!existing) {
      return notFoundResponse('Order');
    }

    const updates: Record<string, unknown> = {};

    // Update status
    if (body.status !== undefined) {
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(body.status)) {
        return errorResponse('VALIDATION_ERROR', `Invalid status: ${body.status}`, 400);
      }
      updates.status = body.status;
    }

    // Update note
    if (body.note !== undefined) {
      updates.note = body.note;
    }

    // Update tags
    if (body.tags !== undefined) {
      updates.tags = body.tags;
    }

    const updated = db.updateOrder(id, updates);

    return successResponse({
      order: {
        id: updated?.id,
        status: updated?.status,
        updated_at: updated?.updatedAt,
      },
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to update order', 500);
  }
}

// POST /api/orders/[id]/cancel - Cancel an order
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const url = new URL(request.url);

    // Check if this is a cancel action
    if (url.pathname.endsWith('/cancel')) {
      const existing = db.getOrder(id);
      if (!existing) {
        return notFoundResponse('Order');
      }

      if (existing.status === 'delivered') {
        return errorResponse('INVALID_ACTION', 'Cannot cancel a delivered order', 400);
      }

      // Restore inventory
      for (const item of existing.items) {
        db.adjustInventory(item.id, item.quantity);
      }

      const updated = db.updateOrder(id, { status: 'cancelled' });

      return successResponse({
        order: {
          id: updated?.id,
          status: updated?.status,
          cancelled_at: updated?.updatedAt,
        },
      });
    }

    return errorResponse('NOT_FOUND', 'Action not found', 404);
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to cancel order', 500);
  }
}
