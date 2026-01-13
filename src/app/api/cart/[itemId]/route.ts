// Single Cart Item API
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from '@/lib/api/helpers';

// DELETE /api/cart/[itemId] - Remove item from cart
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const cartToken = request.headers.get('X-Cart-Token');

    if (!cartToken) {
      return errorResponse('MISSING_TOKEN', 'Cart token is required', 400);
    }

    const cart = db.getCartByToken(cartToken);
    if (!cart) {
      return notFoundResponse('Cart');
    }

    const itemIndex = cart.items.findIndex(i => i.id === itemId);
    if (itemIndex === -1) {
      return notFoundResponse('Cart item');
    }

    const removedItem = cart.items[itemIndex];
    cart.items.splice(itemIndex, 1);
    cart.updatedAt = new Date().toISOString();
    db.updateCart(cart.id, cart);

    return successResponse({
      removed_item: {
        id: removedItem.id,
        product_id: removedItem.productId,
        title: removedItem.title,
        quantity: removedItem.quantity,
      },
      cart: formatCartSummary(cart),
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to remove item', 500);
  }
}

// PUT /api/cart/[itemId] - Update item quantity
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const cartToken = request.headers.get('X-Cart-Token');

    if (!cartToken) {
      return errorResponse('MISSING_TOKEN', 'Cart token is required', 400);
    }

    const cart = db.getCartByToken(cartToken);
    if (!cart) {
      return notFoundResponse('Cart');
    }

    const body = await request.json();
    const itemIndex = cart.items.findIndex(i => i.id === itemId);
    
    if (itemIndex === -1) {
      return notFoundResponse('Cart item');
    }

    const item = cart.items[itemIndex];

    // Update quantity
    if (body.quantity !== undefined) {
      const newQuantity = parseInt(body.quantity);
      
      if (newQuantity <= 0) {
        // Remove item if quantity is 0 or negative
        cart.items.splice(itemIndex, 1);
      } else {
        // Check inventory
        const inventory = db.getInventoryByProduct(item.productId);
        const availableQty = inventory ? inventory.quantity - (inventory.reservedQuantity || 0) : 999;
        
        if (newQuantity > availableQty) {
          return errorResponse(
            'INSUFFICIENT_INVENTORY',
            `Only ${availableQty} units available`,
            422
          );
        }
        
        cart.items[itemIndex].quantity = newQuantity;
      }
    }

    // Update properties
    if (body.properties !== undefined) {
      cart.items[itemIndex].properties = body.properties;
    }

    cart.updatedAt = new Date().toISOString();
    db.updateCart(cart.id, cart);

    return successResponse({
      item: cart.items[itemIndex] ? {
        id: cart.items[itemIndex].id,
        product_id: cart.items[itemIndex].productId,
        title: cart.items[itemIndex].title,
        quantity: cart.items[itemIndex].quantity,
        price: cart.items[itemIndex].price,
        line_price: cart.items[itemIndex].price * cart.items[itemIndex].quantity,
      } : null,
      cart: formatCartSummary(cart),
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to update item', 500);
  }
}

function formatCartSummary(cart: any) {
  const subtotal = cart.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  
  return {
    id: cart.id,
    token: cart.token,
    item_count: cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0),
    total_price: subtotal,
    updated_at: cart.updatedAt,
  };
}
