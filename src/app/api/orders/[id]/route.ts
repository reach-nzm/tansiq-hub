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
    const order = db.getOrder(id) as any;

    if (!order) {
      return notFoundResponse('Order');
    }

    const email = order.email || order.customer?.email || '';
    const customerName = order.customer?.name || `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim();
    const subtotal = order.subtotal || order.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const status = order.status || (order.fulfillmentStatus === 'fulfilled' ? 'delivered' : 'pending');

    return successResponse({
      order: {
        id: order.id,
        order_number: order.orderNumber || order.id.replace('ORD-', ''),
        email: email,
        created_at: order.createdAt,
        updated_at: order.updatedAt,
        closed_at: status === 'delivered' ? order.updatedAt : null,
        cancelled_at: status === 'cancelled' ? order.updatedAt : null,
        total_price: order.total.toFixed(2),
        subtotal_price: subtotal.toFixed(2),
        total_tax: (order.totalTax || order.total * 0.08).toFixed(2),
        total_discounts: (order.totalDiscount || 0).toFixed(2),
        currency: order.currency || 'USD',
        financial_status: order.financialStatus || 'paid',
        fulfillment_status: order.fulfillmentStatus || (status === 'delivered' ? 'fulfilled' : status === 'shipped' ? 'partial' : null),
        name: `#${order.orderNumber || order.id.replace('ORD-', '')}`,
        note: order.note || null,
        line_items: order.items.map((item: any, index: number) => ({
          id: item.id || `li-${index}`,
          product_id: item.productId || item.id,
          variant_id: item.variantId || item.id,
          title: item.title || item.name,
          quantity: item.quantity,
          price: item.price.toFixed(2),
          sku: item.sku || `SKU-${(item.productId || item.id).toString().padStart(6, '0')}`,
          fulfillable_quantity: status === 'pending' ? item.quantity : 0,
          fulfillment_status: status === 'delivered' ? 'fulfilled' : null,
        })),
        customer: order.customer ? {
          id: order.customerId || order.customer.email,
          email: order.customer.email,
          first_name: customerName.split(' ')[0],
          last_name: customerName.split(' ').slice(1).join(' '),
          phone: order.customer.phone,
          orders_count: 1,
          total_spent: order.total.toFixed(2),
        } : null,
        billing_address: order.billingAddress || (order.customer ? {
          first_name: customerName.split(' ')[0],
          last_name: customerName.split(' ').slice(1).join(' '),
          address1: order.customer.address,
          city: order.customer.city,
          country: order.customer.country,
          phone: order.customer.phone,
        } : null),
        shipping_address: order.shippingAddress || (order.customer ? {
          first_name: customerName.split(' ')[0],
          last_name: customerName.split(' ').slice(1).join(' '),
          address1: order.customer.address,
          city: order.customer.city,
          country: order.customer.country,
          phone: order.customer.phone,
        } : null),
        fulfillments: order.fulfillments?.length ? order.fulfillments : (status === 'shipped' || status === 'delivered' ? [{
          id: `ful-${order.id}`,
          order_id: order.id,
          status: status === 'delivered' ? 'success' : 'pending',
          created_at: order.updatedAt,
          tracking_number: null,
          tracking_url: null,
        }] : []),
        refunds: order.refunds || [],
        status: status,
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
