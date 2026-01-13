// Cart API - Shopify-like Shopping Cart
import { NextRequest } from 'next/server';
import { db, Cart } from '@/lib/db';
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  generateId,
} from '@/lib/api/helpers';

// GET /api/cart - Get cart by token (in header or query)
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const cartToken = request.headers.get('X-Cart-Token') || url.searchParams.get('token');

    if (!cartToken) {
      return errorResponse('MISSING_TOKEN', 'Cart token is required', 400);
    }

    const cart = db.getCartByToken(cartToken);
    if (!cart) {
      return notFoundResponse('Cart');
    }

    return successResponse({
      cart: formatCart(cart),
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to fetch cart', 500);
  }
}

// POST /api/cart - Create a new cart or add items
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action || 'create';

    if (action === 'create') {
      // Create a new cart
      const cartToken = generateId('cart_token');
      
      const cart: Cart = {
        id: generateId('cart'),
        token: cartToken,
        items: [],
        note: body.note || '',
        attributes: body.attributes || {},
        customerId: body.customer_id,
        discountCodes: [],
        shippingRate: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add initial items if provided
      if (body.items && Array.isArray(body.items)) {
        for (const item of body.items) {
          const product = db.getProduct(item.product_id);
          if (product) {
            const inventory = db.getInventoryByProduct(item.product_id);
            const availableQty = inventory ? inventory.quantity - (inventory.reservedQuantity || 0) : 999;

            cart.items.push({
              id: generateId('item'),
              productId: item.product_id,
              variantId: item.variant_id,
              quantity: Math.min(item.quantity || 1, availableQty),
              price: product.price,
              title: product.name,
              image: product.images?.[0],
              properties: item.properties || {},
            });
          }
        }
      }

      const created = db.createCart(cart);

      return successResponse({
        cart: formatCart(created),
        cart_token: cartToken,
      });
    }

    if (action === 'add') {
      const cartToken = request.headers.get('X-Cart-Token') || body.cart_token;
      if (!cartToken) {
        return errorResponse('MISSING_TOKEN', 'Cart token is required', 400);
      }

      const cart = db.getCartByToken(cartToken);
      if (!cart) {
        return notFoundResponse('Cart');
      }

      const { product_id, variant_id, quantity = 1, properties } = body;
      const product = db.getProduct(product_id);

      if (!product) {
        return errorResponse('PRODUCT_NOT_FOUND', 'Product not found', 404);
      }

      // Check inventory
      const inventory = db.getInventoryByProduct(product_id);
      const availableQty = inventory ? inventory.quantity - (inventory.reservedQuantity || 0) : 999;

      // Check if item already exists in cart
      const existingIndex = cart.items.findIndex(
        i => i.productId === product_id && i.variantId === variant_id
      );

      if (existingIndex >= 0) {
        const newQty = cart.items[existingIndex].quantity + quantity;
        cart.items[existingIndex].quantity = Math.min(newQty, availableQty);
      } else {
        cart.items.push({
          id: generateId('item'),
          productId: product_id,
          variantId: variant_id,
          quantity: Math.min(quantity, availableQty),
          price: product.price,
          title: product.name,
          image: product.images?.[0],
          properties: properties || {},
        });
      }

      cart.updatedAt = new Date().toISOString();
      db.updateCart(cart.id, cart);

      return successResponse({
        cart: formatCart(cart),
      });
    }

    return errorResponse('INVALID_ACTION', 'Invalid action', 400);
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to process cart', 500);
  }
}

// PUT /api/cart - Update cart (items, note, attributes)
export async function PUT(request: NextRequest) {
  try {
    const cartToken = request.headers.get('X-Cart-Token');
    if (!cartToken) {
      return errorResponse('MISSING_TOKEN', 'Cart token is required', 400);
    }

    const cart = db.getCartByToken(cartToken);
    if (!cart) {
      return notFoundResponse('Cart');
    }

    const body = await request.json();

    // Update note
    if (body.note !== undefined) {
      cart.note = body.note;
    }

    // Update attributes
    if (body.attributes !== undefined) {
      cart.attributes = body.attributes;
    }

    // Update items quantities
    if (body.updates && typeof body.updates === 'object') {
      for (const [itemId, quantity] of Object.entries(body.updates)) {
        const itemIndex = cart.items.findIndex(i => i.id === itemId);
        if (itemIndex >= 0) {
          if (quantity === 0) {
            cart.items.splice(itemIndex, 1);
          } else {
            const inventory = db.getInventoryByProduct(cart.items[itemIndex].productId);
            const availableQty = inventory ? inventory.quantity - (inventory.reservedQuantity || 0) : 999;
            cart.items[itemIndex].quantity = Math.min(quantity as number, availableQty);
          }
        }
      }
    }

    // Apply discount code
    if (body.discount_code) {
      const discount = db.getDiscountByCode(body.discount_code);
      if (discount && discount.active) {
        if (!cart.discountCodes.includes(discount.code)) {
          cart.discountCodes.push(discount.code);
        }
      } else {
        return errorResponse('INVALID_DISCOUNT', 'Invalid or expired discount code', 422);
      }
    }

    // Remove discount code
    if (body.remove_discount_code) {
      cart.discountCodes = cart.discountCodes.filter(c => c !== body.remove_discount_code);
    }

    cart.updatedAt = new Date().toISOString();
    db.updateCart(cart.id, cart);

    return successResponse({
      cart: formatCart(cart),
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to update cart', 500);
  }
}

// DELETE /api/cart - Clear cart
export async function DELETE(request: NextRequest) {
  try {
    const cartToken = request.headers.get('X-Cart-Token');
    if (!cartToken) {
      return errorResponse('MISSING_TOKEN', 'Cart token is required', 400);
    }

    const cart = db.getCartByToken(cartToken);
    if (!cart) {
      return notFoundResponse('Cart');
    }

    cart.items = [];
    cart.discountCodes = [];
    cart.shippingRate = null;
    cart.updatedAt = new Date().toISOString();
    db.updateCart(cart.id, cart);

    return successResponse({
      cart: formatCart(cart),
      message: 'Cart cleared',
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to clear cart', 500);
  }
}

// Helper function to format cart
function formatCart(cart: Cart) {
  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate discount
  let totalDiscount = 0;
  const appliedDiscounts: any[] = [];
  
  for (const code of cart.discountCodes) {
    const discount = db.getDiscountByCode(code);
    if (discount) {
      let discountAmount = 0;
      if (discount.type === 'percentage') {
        discountAmount = subtotal * (discount.value / 100);
      } else if (discount.type === 'fixed_amount') {
        discountAmount = Math.min(discount.value, subtotal);
      }
      totalDiscount += discountAmount;
      appliedDiscounts.push({
        code: discount.code,
        type: discount.type,
        value: discount.value,
        amount: discountAmount,
      });
    }
  }

  const shippingCost = cart.shippingRate?.price || 0;
  const total = subtotal - totalDiscount + shippingCost;

  return {
    id: cart.id,
    token: cart.token,
    item_count: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    items: cart.items.map(item => ({
      id: item.id,
      product_id: item.productId,
      variant_id: item.variantId || null,
      title: item.title,
      quantity: item.quantity,
      price: item.price,
      line_price: item.price * item.quantity,
      image: item.image,
      properties: item.properties,
    })),
    note: cart.note,
    attributes: cart.attributes,
    original_total_price: subtotal,
    total_discount: totalDiscount,
    total_price: total,
    discount_codes: appliedDiscounts,
    shipping_rate: cart.shippingRate ? {
      name: cart.shippingRate.name,
      price: cart.shippingRate.price,
    } : null,
    requires_shipping: cart.items.length > 0,
    currency: 'USD',
    created_at: cart.createdAt,
    updated_at: cart.updatedAt,
  };
}
