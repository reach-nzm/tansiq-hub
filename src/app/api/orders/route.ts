// Orders API - Shopify-like Order Management
import { NextRequest } from 'next/server';
import { db, Order } from '@/lib/db';
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

// GET /api/orders - List all orders
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const { page, limit, sort, order, status } = parseQueryParams(url);
    const customerId = url.searchParams.get('customer_id');
    const email = url.searchParams.get('email');
    const sinceId = url.searchParams.get('since_id');
    const createdAtMin = url.searchParams.get('created_at_min');
    const createdAtMax = url.searchParams.get('created_at_max');
    const financialStatus = url.searchParams.get('financial_status');
    const fulfillmentStatus = url.searchParams.get('fulfillment_status');

    let orders = db.getOrders() as any[];

    // Filter by customer
    if (customerId) {
      const customer = db.getCustomer(customerId);
      if (customer) {
        orders = orders.filter(o => (o.email || o.customer?.email) === customer.email);
      }
    }

    // Filter by email
    if (email) {
      orders = orders.filter(o => (o.email || o.customer?.email)?.toLowerCase() === email.toLowerCase());
    }

    // Filter by status
    if (status) {
      orders = orders.filter(o => o.status === status);
    }

    // Filter by fulfillment status (maps to our status)
    if (fulfillmentStatus) {
      const statusMap: Record<string, string[]> = {
        'unfulfilled': ['pending', 'processing'],
        'fulfilled': ['shipped', 'delivered'],
        'partial': ['processing'],
      };
      const allowedStatuses = statusMap[fulfillmentStatus] || [];
      orders = orders.filter(o => o.status && allowedStatuses.includes(o.status));
    }

    // Filter by date range
    if (createdAtMin) {
      const minDate = new Date(createdAtMin);
      orders = orders.filter(o => new Date(o.createdAt) >= minDate);
    }
    if (createdAtMax) {
      const maxDate = new Date(createdAtMax);
      orders = orders.filter(o => new Date(o.createdAt) <= maxDate);
    }

    // Sort by date
    orders.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return order === 'desc' ? dateB - dateA : dateA - dateB;
    });

    // Paginate
    const { items, meta } = paginate(orders, page, limit);

    // Format orders for response
    const formattedOrders = items.map((o: any) => ({
      id: o.id,
      order_number: o.orderNumber || o.id.replace('ORD-', ''),
      email: o.email || o.customer?.email,
      created_at: o.createdAt,
      updated_at: o.updatedAt,
      total_price: o.total.toFixed(2),
      subtotal_price: (o.subtotal || o.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)).toFixed(2),
      total_tax: (o.totalTax || o.total * 0.08).toFixed(2),
      currency: o.currency || 'USD',
      financial_status: o.financialStatus || 'paid',
      fulfillment_status: o.fulfillmentStatus || (o.status === 'delivered' ? 'fulfilled' : o.status === 'shipped' ? 'partial' : null),
      name: `#${o.orderNumber || o.id.replace('ORD-', '')}`,
      line_items: o.items.map((item: any) => ({
        id: item.id,
        product_id: item.productId || item.id,
        title: item.title || item.name,
        quantity: item.quantity,
        price: item.price.toFixed(2),
        total_discount: '0.00',
      })),
      customer: o.customer ? {
        id: o.customer.email,
        email: o.customer.email,
        first_name: o.customer.name?.split(' ')[0] || '',
        last_name: o.customer.name?.split(' ').slice(1).join(' ') || '',
        phone: o.customer.phone,
      } : null,
      shipping_address: o.shippingAddress || (o.customer ? {
        address1: o.customer.address,
        city: o.customer.city,
        country: o.customer.country,
      } : null),
      status: o.status,
    }));

    return successResponse({ orders: formattedOrders }, meta);
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to fetch orders', 500);
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const validationErrors = validateRequired(body, ['line_items', 'customer']);
    if (validationErrors) {
      return validationError(validationErrors);
    }

    if (!body.line_items || body.line_items.length === 0) {
      return validationError({ line_items: ['At least one line item is required'] });
    }

    // Build order items
    const items = [];
    let subtotal = 0;

    for (const lineItem of body.line_items) {
      const product = db.getProduct(lineItem.product_id);
      if (!product) {
        return validationError({ line_items: [`Product ${lineItem.product_id} not found`] });
      }

      const quantity = parseInt(lineItem.quantity) || 1;
      const price = lineItem.price ? parseFloat(lineItem.price) : product.price;

      items.push({
        ...product,
        quantity,
        price,
      });

      subtotal += price * quantity;

      // Update inventory
      db.adjustInventory(product.id, -quantity);
    }

    // Calculate totals
    const taxRate = 0.08;
    const tax = subtotal * taxRate;
    const shipping = body.shipping_price ? parseFloat(body.shipping_price) : 0;
    const discount = body.total_discounts ? parseFloat(body.total_discounts) : 0;
    const total = subtotal + tax + shipping - discount;

    const order: Order = {
      id: `ORD-${generateId()}`.toUpperCase().slice(0, 12),
      items,
      total,
      status: 'pending',
      customer: {
        name: `${body.customer.first_name || ''} ${body.customer.last_name || ''}`.trim(),
        email: body.customer.email,
        phone: body.customer.phone || '',
        address: body.shipping_address?.address1 || '',
        city: body.shipping_address?.city || '',
        country: body.shipping_address?.country || 'United States',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const created = db.createOrder(order);

    // Update customer stats
    const customer = db.getCustomerByEmail(order.customer.email);
    if (customer) {
      db.updateCustomer(customer.id, {
        ordersCount: (customer.ordersCount || 0) + 1,
        totalSpent: (customer.totalSpent || 0) + total,
        lastOrderId: order.id,
        lastOrderDate: order.createdAt,
      });
    }

    return successResponse({
      order: {
        id: created.id,
        order_number: created.id.replace('ORD-', ''),
        created_at: created.createdAt,
        total_price: created.total.toFixed(2),
        status: created.status,
        financial_status: 'paid',
        line_items_count: created.items.length,
      },
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to create order', 500);
  }
}
