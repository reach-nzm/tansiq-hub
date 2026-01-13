// Inventory API - Shopify-like Inventory Management
import { NextRequest } from 'next/server';
import { db, Inventory } from '@/lib/db';
import {
  successResponse,
  errorResponse,
  paginate,
  parseQueryParams,
} from '@/lib/api/helpers';

// GET /api/inventory - List all inventory items
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const { page, limit, sort, order } = parseQueryParams(url);
    const productId = url.searchParams.get('product_id');
    const lowStock = url.searchParams.get('low_stock');

    let inventory = db.getInventory();

    // Filter by product ID
    if (productId) {
      const item = db.getInventoryByProduct(productId);
      if (item) {
        const product = db.getProduct(productId);
        return successResponse({
          inventory_item: formatInventoryItem(item, product),
        });
      }
      return successResponse({ inventory_item: null });
    }

    // Filter low stock items
    if (lowStock === 'true') {
      inventory = inventory.filter(i => 
        i.tracked && i.quantity <= (i.lowStockThreshold || 10)
      );
    }

    // Sort by quantity
    if (sort === 'quantity') {
      inventory.sort((a, b) => {
        const comparison = a.quantity - b.quantity;
        return order === 'desc' ? -comparison : comparison;
      });
    } else {
      // Default sort by updated date
      inventory.sort((a, b) => {
        const comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        return order === 'desc' ? -comparison : comparison;
      });
    }

    // Paginate
    const { items, meta } = paginate(inventory, page, limit);

    // Get product details for each inventory item
    const inventoryWithProducts = items.map(item => {
      const product = db.getProduct(item.productId);
      return formatInventoryItem(item, product);
    });

    return successResponse({
      inventory_items: inventoryWithProducts,
    }, meta);
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to fetch inventory', 500);
  }
}

// POST /api/inventory - Adjust inventory levels
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adjustments } = body;

    if (!adjustments || !Array.isArray(adjustments)) {
      return errorResponse('VALIDATION_ERROR', 'Adjustments array is required', 400);
    }

    const results: { success: any[]; errors: any[] } = {
      success: [],
      errors: [],
    };

    for (const adj of adjustments) {
      const { product_id, adjustment, reason } = adj;

      if (!product_id || adjustment === undefined) {
        results.errors.push({
          product_id,
          error: 'product_id and adjustment are required',
        });
        continue;
      }

      const inventory = db.getInventoryByProduct(product_id);
      if (!inventory) {
        results.errors.push({
          product_id,
          error: 'Inventory item not found',
        });
        continue;
      }

      const newQuantity = inventory.quantity + parseInt(adjustment);
      if (newQuantity < 0) {
        results.errors.push({
          product_id,
          error: 'Cannot adjust below zero',
          current_quantity: inventory.quantity,
        });
        continue;
      }

      const updated = db.updateInventory(inventory.id, {
        quantity: newQuantity,
        updatedAt: new Date().toISOString(),
      });

      if (updated) {
        const product = db.getProduct(product_id);
        results.success.push({
          product_id,
          previous_quantity: inventory.quantity,
          adjustment: parseInt(adjustment),
          new_quantity: newQuantity,
          reason: reason || 'manual_adjustment',
          product_title: product?.name,
        });
      }
    }

    return successResponse({
      results,
      total_adjusted: results.success.length,
      total_errors: results.errors.length,
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to adjust inventory', 500);
  }
}

// Helper function to format inventory item
function formatInventoryItem(item: Inventory, product: any) {
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
    is_low_stock: item.tracked && item.quantity <= (item.lowStockThreshold || 10),
    updated_at: item.updatedAt,
    product: product ? {
      id: product.id,
      title: product.name,
      image: product.images?.[0] || null,
    } : null,
  };
}
