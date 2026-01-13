// Single Inventory Item API
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from '@/lib/api/helpers';

// GET /api/inventory/[id] - Get a single inventory item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const inventory = db.getInventoryItem(id);

    if (!inventory) {
      return notFoundResponse('Inventory item');
    }

    const product = db.getProduct(inventory.productId);

    return successResponse({
      inventory_item: {
        id: inventory.id,
        product_id: inventory.productId,
        variant_id: inventory.variantId || null,
        sku: inventory.sku || null,
        quantity: inventory.quantity,
        available: inventory.quantity - (inventory.reservedQuantity || 0),
        reserved: inventory.reservedQuantity || 0,
        incoming: inventory.incomingQuantity || 0,
        tracked: inventory.tracked,
        low_stock_threshold: inventory.lowStockThreshold || 10,
        updated_at: inventory.updatedAt,
        product: product ? {
          id: product.id,
          title: product.name,
        } : null,
      },
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to fetch inventory item', 500);
  }
}

// PUT /api/inventory/[id] - Update inventory item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = db.getInventoryItem(id);
    if (!existing) {
      return notFoundResponse('Inventory item');
    }

    const updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (body.quantity !== undefined) updates.quantity = parseInt(body.quantity);
    if (body.sku !== undefined) updates.sku = body.sku;
    if (body.tracked !== undefined) updates.tracked = body.tracked;
    if (body.low_stock_threshold !== undefined) updates.lowStockThreshold = parseInt(body.low_stock_threshold);
    if (body.reserved_quantity !== undefined) updates.reservedQuantity = parseInt(body.reserved_quantity);
    if (body.incoming_quantity !== undefined) updates.incomingQuantity = parseInt(body.incoming_quantity);

    const updated = db.updateInventory(id, updates);
    const product = db.getProduct(updated!.productId);

    return successResponse({
      inventory_item: {
        id: updated!.id,
        product_id: updated!.productId,
        variant_id: updated!.variantId || null,
        sku: updated!.sku || null,
        quantity: updated!.quantity,
        available: updated!.quantity - (updated!.reservedQuantity || 0),
        reserved: updated!.reservedQuantity || 0,
        incoming: updated!.incomingQuantity || 0,
        tracked: updated!.tracked,
        low_stock_threshold: updated!.lowStockThreshold || 10,
        updated_at: updated!.updatedAt,
        product: product ? {
          id: product.id,
          title: product.name,
        } : null,
      },
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to update inventory item', 500);
  }
}

// POST /api/inventory/[id] - Inventory actions (set, adjust)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const body = await request.json();

    const existing = db.getInventoryItem(id);
    if (!existing) {
      return notFoundResponse('Inventory item');
    }

    if (action === 'set') {
      // Set to exact quantity
      const { quantity } = body;
      if (quantity === undefined || quantity < 0) {
        return errorResponse('VALIDATION_ERROR', 'Valid quantity is required', 400);
      }

      const updated = db.updateInventory(id, {
        quantity: parseInt(quantity),
        updatedAt: new Date().toISOString(),
      });

      return successResponse({
        inventory_item: formatInventoryItem(updated!),
        action: 'set',
        previous_quantity: existing.quantity,
        new_quantity: updated!.quantity,
      });
    }

    if (action === 'adjust') {
      // Adjust by amount (positive or negative)
      const { adjustment, reason } = body;
      if (adjustment === undefined) {
        return errorResponse('VALIDATION_ERROR', 'Adjustment amount is required', 400);
      }

      const newQuantity = existing.quantity + parseInt(adjustment);
      if (newQuantity < 0) {
        return errorResponse(
          'INVALID_ADJUSTMENT',
          `Cannot adjust below zero. Current: ${existing.quantity}, Adjustment: ${adjustment}`,
          422
        );
      }

      const updated = db.updateInventory(id, {
        quantity: newQuantity,
        updatedAt: new Date().toISOString(),
      });

      return successResponse({
        inventory_item: formatInventoryItem(updated!),
        action: 'adjust',
        adjustment: parseInt(adjustment),
        reason: reason || 'manual',
        previous_quantity: existing.quantity,
        new_quantity: updated!.quantity,
      });
    }

    if (action === 'reserve') {
      // Reserve inventory for pending orders
      const { quantity } = body;
      if (quantity === undefined || quantity <= 0) {
        return errorResponse('VALIDATION_ERROR', 'Valid quantity is required', 400);
      }

      const available = existing.quantity - (existing.reservedQuantity || 0);
      if (parseInt(quantity) > available) {
        return errorResponse(
          'INSUFFICIENT_INVENTORY',
          `Only ${available} units available for reservation`,
          422
        );
      }

      const updated = db.updateInventory(id, {
        reservedQuantity: (existing.reservedQuantity || 0) + parseInt(quantity),
        updatedAt: new Date().toISOString(),
      });

      return successResponse({
        inventory_item: formatInventoryItem(updated!),
        action: 'reserve',
        reserved_quantity: parseInt(quantity),
      });
    }

    if (action === 'release') {
      // Release reserved inventory
      const { quantity } = body;
      if (quantity === undefined || quantity <= 0) {
        return errorResponse('VALIDATION_ERROR', 'Valid quantity is required', 400);
      }

      const toRelease = Math.min(parseInt(quantity), existing.reservedQuantity || 0);
      
      const updated = db.updateInventory(id, {
        reservedQuantity: (existing.reservedQuantity || 0) - toRelease,
        updatedAt: new Date().toISOString(),
      });

      return successResponse({
        inventory_item: formatInventoryItem(updated!),
        action: 'release',
        released_quantity: toRelease,
      });
    }

    return errorResponse('INVALID_ACTION', 'Invalid action. Use: set, adjust, reserve, or release', 400);
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to process inventory action', 500);
  }
}

function formatInventoryItem(item: any) {
  const product = db.getProduct(item.productId);
  return {
    id: item.id,
    product_id: item.productId,
    variant_id: item.variantId || null,
    sku: item.sku || null,
    quantity: item.quantity,
    available: item.quantity - (item.reservedQuantity || 0),
    reserved: item.reservedQuantity || 0,
    incoming: item.incomingQuantity || 0,
    tracked: item.tracked,
    low_stock_threshold: item.lowStockThreshold || 10,
    updated_at: item.updatedAt,
    product: product ? {
      id: product.id,
      title: product.name,
    } : null,
  };
}
