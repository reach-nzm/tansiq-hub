// Checkout API - Shopify-like Checkout Process
import { NextRequest } from 'next/server';
import { db, Order, Customer } from '@/lib/db';
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  validationError,
  generateId,
  validateRequired,
} from '@/lib/api/helpers';

// POST /api/checkout - Create checkout or process order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action || 'create';

    if (action === 'create') {
      return handleCreateCheckout(body, request);
    }

    if (action === 'complete') {
      return handleCompleteCheckout(body, request);
    }

    if (action === 'calculate') {
      return handleCalculateTotals(body, request);
    }

    return errorResponse('INVALID_ACTION', 'Invalid action', 400);
  } catch (error) {
    console.error('Checkout error:', error);
    return errorResponse('SERVER_ERROR', 'Failed to process checkout', 500);
  }
}

// GET /api/checkout - Get checkout session
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const checkoutId = url.searchParams.get('checkout_id');
    const cartToken = request.headers.get('X-Cart-Token') || url.searchParams.get('cart_token');

    if (checkoutId) {
      // In a real app, you'd store checkout sessions
      // For now, return cart-based checkout
      return errorResponse('NOT_IMPLEMENTED', 'Checkout session lookup not implemented', 501);
    }

    if (!cartToken) {
      return errorResponse('MISSING_TOKEN', 'Cart token or checkout ID is required', 400);
    }

    const cart = db.getCartByToken(cartToken);
    if (!cart) {
      return notFoundResponse('Cart');
    }

    if (cart.items.length === 0) {
      return errorResponse('EMPTY_CART', 'Cart is empty', 422);
    }

    // Get available shipping rates
    const shippingRates = db.getShippingRates();
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return successResponse({
      checkout: {
        cart_id: cart.id,
        cart_token: cart.token,
        line_items: cart.items.map(item => ({
          product_id: item.productId,
          variant_id: item.variantId,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        })),
        subtotal,
        requires_shipping: true,
        available_shipping_rates: shippingRates.map(rate => ({
          id: rate.id,
          name: rate.name,
          price: rate.price,
          min_order: rate.minOrder || 0,
          estimated_days: `${rate.minDays}-${rate.maxDays} business days`,
        })),
      },
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to fetch checkout', 500);
  }
}

// Create a new checkout session
async function handleCreateCheckout(body: any, request: NextRequest) {
  const cartToken = request.headers.get('X-Cart-Token') || body.cart_token;

  if (!cartToken) {
    return errorResponse('MISSING_TOKEN', 'Cart token is required', 400);
  }

  const cart = db.getCartByToken(cartToken);
  if (!cart) {
    return notFoundResponse('Cart');
  }

  if (cart.items.length === 0) {
    return errorResponse('EMPTY_CART', 'Cart is empty', 422);
  }

  // Validate inventory availability
  for (const item of cart.items) {
    const inventory = db.getInventoryByProduct(item.productId);
    if (inventory && inventory.tracked) {
      const available = inventory.quantity - (inventory.reservedQuantity || 0);
      if (item.quantity > available) {
        return errorResponse(
          'INSUFFICIENT_INVENTORY',
          `Only ${available} units of "${item.title}" available`,
          422
        );
      }
    }
  }

  const checkoutId = generateId('checkout');
  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return successResponse({
    checkout: {
      id: checkoutId,
      cart_token: cartToken,
      status: 'created',
      subtotal,
      item_count: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      created_at: new Date().toISOString(),
    },
    next_steps: [
      'Add shipping address',
      'Select shipping method',
      'Add payment method',
      'Complete checkout',
    ],
  });
}

// Calculate totals with shipping and discounts
async function handleCalculateTotals(body: any, request: NextRequest) {
  const cartToken = request.headers.get('X-Cart-Token') || body.cart_token;

  if (!cartToken) {
    return errorResponse('MISSING_TOKEN', 'Cart token is required', 400);
  }

  const cart = db.getCartByToken(cartToken);
  if (!cart) {
    return notFoundResponse('Cart');
  }

  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Calculate discount
  let totalDiscount = 0;
  if (body.discount_code) {
    const discount = db.getDiscountByCode(body.discount_code);
    if (discount && discount.active) {
      if (discount.type === 'percentage') {
        totalDiscount = subtotal * (discount.value / 100);
      } else if (discount.type === 'fixed_amount') {
        totalDiscount = Math.min(discount.value, subtotal);
      }
    }
  }

  // Get shipping cost
  let shippingCost = 0;
  if (body.shipping_rate_id) {
    const rate = db.getShippingRate(body.shipping_rate_id);
    if (rate) {
      shippingCost = rate.price;
      // Check for free shipping threshold
      if (rate.minOrder && (subtotal - totalDiscount) >= rate.minOrder) {
        shippingCost = 0;
      }
    }
  }

  // Calculate tax (example: 8% tax)
  const taxRate = 0.08;
  const taxableAmount = subtotal - totalDiscount;
  const tax = taxableAmount * taxRate;

  const total = subtotal - totalDiscount + shippingCost + tax;

  return successResponse({
    totals: {
      subtotal,
      discount: totalDiscount,
      shipping: shippingCost,
      tax,
      total,
      currency: 'USD',
    },
    breakdown: {
      items_subtotal: subtotal,
      discount_code: body.discount_code || null,
      discount_amount: totalDiscount,
      shipping_method: body.shipping_rate_id || null,
      shipping_cost: shippingCost,
      tax_rate: `${taxRate * 100}%`,
      tax_amount: tax,
      grand_total: total,
    },
  });
}

// Complete checkout and create order
async function handleCompleteCheckout(body: any, request: NextRequest) {
  const cartToken = request.headers.get('X-Cart-Token') || body.cart_token;

  if (!cartToken) {
    return errorResponse('MISSING_TOKEN', 'Cart token is required', 400);
  }

  const cart = db.getCartByToken(cartToken);
  if (!cart) {
    return notFoundResponse('Cart');
  }

  if (cart.items.length === 0) {
    return errorResponse('EMPTY_CART', 'Cart is empty', 422);
  }

  // Validate required checkout fields
  const requiredFields = validateRequired(body, ['email', 'shipping_address']);
  if (requiredFields) {
    return validationError(requiredFields);
  }

  // Validate shipping address
  const addressFields = validateRequired(body.shipping_address, [
    'first_name', 'last_name', 'address1', 'city', 'country', 'zip'
  ]);
  if (addressFields) {
    // Flatten address errors with prefix
    const flattenedErrors: Record<string, string[]> = {};
    for (const [key, value] of Object.entries(addressFields)) {
      flattenedErrors[`shipping_address.${key}`] = value;
    }
    return validationError(flattenedErrors);
  }

  // Validate inventory one more time
  for (const item of cart.items) {
    const inventory = db.getInventoryByProduct(item.productId);
    if (inventory && inventory.tracked) {
      const available = inventory.quantity - (inventory.reservedQuantity || 0);
      if (item.quantity > available) {
        return errorResponse(
          'INSUFFICIENT_INVENTORY',
          `Only ${available} units of "${item.title}" available`,
          422
        );
      }
    }
  }

  // Calculate totals
  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let totalDiscount = 0;
  if (body.discount_code) {
    const discount = db.getDiscountByCode(body.discount_code);
    if (discount && discount.active) {
      if (discount.type === 'percentage') {
        totalDiscount = subtotal * (discount.value / 100);
      } else if (discount.type === 'fixed_amount') {
        totalDiscount = Math.min(discount.value, subtotal);
      }
      // Increment discount usage
      db.updateDiscount(discount.id, { usedCount: discount.usedCount + 1 });
    }
  }

  let shippingCost = 0;
  let shippingMethod = 'Standard Shipping';
  if (body.shipping_rate_id) {
    const rate = db.getShippingRate(body.shipping_rate_id);
    if (rate) {
      shippingCost = rate.price;
      shippingMethod = rate.name;
    }
  }

  const taxRate = 0.08;
  const tax = (subtotal - totalDiscount) * taxRate;
  const total = subtotal - totalDiscount + shippingCost + tax;

  // Find or create customer
  let customer = db.getCustomerByEmail(body.email);
  if (!customer) {
    customer = db.createCustomer({
      id: generateId('cust'),
      email: body.email,
      firstName: body.shipping_address.first_name,
      lastName: body.shipping_address.last_name,
      phone: body.phone || '',
      addresses: [body.shipping_address],
      defaultAddress: body.shipping_address,
      totalOrders: 0,
      totalSpent: 0,
      tags: ['new_customer'],
      acceptsMarketing: body.accepts_marketing || false,
      createdAt: new Date().toISOString(),
    });
  }

  // Create order
  const orderNumber = 1000 + db.getOrders().length + 1;
  const order: Order = {
    id: generateId('order'),
    orderNumber,
    email: body.email,
    customerId: customer!.id,
    items: cart.items.map(item => ({
      id: generateId('line'),
      productId: item.productId,
      variantId: item.variantId,
      title: item.title,
      quantity: item.quantity,
      price: item.price,
      totalDiscount: 0,
      sku: '',
    })),
    subtotal,
    totalDiscount,
    totalShipping: shippingCost,
    totalTax: tax,
    total,
    currency: 'USD',
    financialStatus: 'paid',
    fulfillmentStatus: 'unfulfilled',
    shippingAddress: body.shipping_address,
    billingAddress: body.billing_address || body.shipping_address,
    shippingMethod,
    paymentMethod: body.payment_method || 'credit_card',
    note: body.note || cart.note,
    tags: [],
    discountCodes: body.discount_code ? [body.discount_code] : [],
    fulfillments: [],
    refunds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const createdOrder = db.createOrder(order);

  // Update inventory
  for (const item of cart.items) {
    const inventory = db.getInventoryByProduct(item.productId);
    if (inventory && inventory.tracked) {
      db.updateInventory(inventory.id, {
        quantity: inventory.quantity - item.quantity,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  // Update customer stats
  if (customer) {
    db.updateCustomer(customer.id, {
      totalOrders: (customer.totalOrders || 0) + 1,
      totalSpent: (customer.totalSpent || 0) + total,
    });
  }

  // Clear cart
  cart.items = [];
  cart.discountCodes = [];
  cart.updatedAt = new Date().toISOString();
  db.updateCart(cart.id, cart);

  return successResponse({
    order: {
      id: createdOrder.id,
      order_number: createdOrder.orderNumber,
      email: createdOrder.email,
      confirmation_number: `TH${createdOrder.orderNumber}`,
      financial_status: createdOrder.financialStatus,
      fulfillment_status: createdOrder.fulfillmentStatus,
      subtotal: createdOrder.subtotal,
      total_discount: createdOrder.totalDiscount,
      total_shipping: createdOrder.totalShipping,
      total_tax: createdOrder.totalTax,
      total: createdOrder.total,
      currency: createdOrder.currency,
      line_items_count: createdOrder.items.length,
      created_at: createdOrder.createdAt,
    },
    message: 'Order created successfully',
    thank_you_url: `/order-confirmation/${createdOrder.id}`,
  });
}
