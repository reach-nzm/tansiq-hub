// Analytics/Reports API - Shopify-like Analytics
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import {
  successResponse,
  errorResponse,
} from '@/lib/api/helpers';

// GET /api/analytics - Get store analytics
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || '30d'; // 7d, 30d, 90d, 365d
    const type = url.searchParams.get('type') || 'overview'; // overview, sales, products, customers

    const orders = db.getOrders();
    const products = db.getProducts();
    const customers = db.getCustomers();
    const inventory = db.getInventory();

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '365d':
        startDate.setDate(now.getDate() - 365);
        break;
    }

    // Filter orders by date
    const periodOrders = orders.filter(o => new Date(o.createdAt) >= startDate);
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const previousPeriodOrders = orders.filter(o => {
      const date = new Date(o.createdAt);
      return date >= previousPeriodStart && date < startDate;
    });

    if (type === 'overview') {
      // Calculate metrics
      const totalSales = periodOrders.reduce((sum, o) => sum + o.total, 0);
      const previousSales = previousPeriodOrders.reduce((sum, o) => sum + o.total, 0);
      const salesGrowth = previousSales > 0 ? ((totalSales - previousSales) / previousSales) * 100 : 0;

      const totalOrders = periodOrders.length;
      const previousTotalOrders = previousPeriodOrders.length;
      const ordersGrowth = previousTotalOrders > 0 ? ((totalOrders - previousTotalOrders) / previousTotalOrders) * 100 : 0;

      const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
      const previousAOV = previousTotalOrders > 0 ? previousSales / previousTotalOrders : 0;
      const aovGrowth = previousAOV > 0 ? ((averageOrderValue - previousAOV) / previousAOV) * 100 : 0;

      // Top products
      const productSales: Record<string, { quantity: number; revenue: number; name: string }> = {};
      periodOrders.forEach(order => {
        order.items.forEach((item: any) => {
          const productId = item.productId || item.id;
          const title = item.title || item.name || 'Unknown';
          if (!productSales[productId]) {
            productSales[productId] = { quantity: 0, revenue: 0, name: title };
          }
          productSales[productId].quantity += item.quantity;
          productSales[productId].revenue += item.price * item.quantity;
        });
      });

      const topProducts = Object.entries(productSales)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Low stock alerts
      const lowStockItems = inventory
        .filter(i => i.tracked && i.quantity <= (i.lowStockThreshold || 10))
        .map(i => {
          const product = db.getProduct(i.productId);
          return {
            product_id: i.productId,
            product_name: product?.name || 'Unknown',
            quantity: i.quantity,
            threshold: i.lowStockThreshold || 10,
          };
        });

      return successResponse({
        period,
        analytics: {
          overview: {
            total_sales: totalSales,
            sales_growth: salesGrowth.toFixed(1),
            total_orders: totalOrders,
            orders_growth: ordersGrowth.toFixed(1),
            average_order_value: averageOrderValue,
            aov_growth: aovGrowth.toFixed(1),
            total_customers: customers.length,
            total_products: products.length,
          },
          top_products: topProducts,
          low_stock_alerts: lowStockItems,
          recent_orders: periodOrders.slice(0, 5).map(o => ({
            id: o.id,
            order_number: o.orderNumber || 0,
            customer: o.email || o.customer?.email || 'Unknown',
            total: o.total,
            status: o.financialStatus || o.status,
            created_at: o.createdAt,
          })),
        },
      });
    }

    if (type === 'sales') {
      // Sales by day
      const salesByDay: Record<string, { date: string; orders: number; revenue: number }> = {};
      periodOrders.forEach(order => {
        const date = order.createdAt.split('T')[0];
        if (!salesByDay[date]) {
          salesByDay[date] = { date, orders: 0, revenue: 0 };
        }
        salesByDay[date].orders++;
        salesByDay[date].revenue += order.total;
      });

      // Sales by payment method
      const salesByPayment: Record<string, { method: string; orders: number; revenue: number }> = {};
      periodOrders.forEach(order => {
        const method = order.paymentMethod || 'unknown';
        if (!salesByPayment[method]) {
          salesByPayment[method] = { method, orders: 0, revenue: 0 };
        }
        salesByPayment[method].orders++;
        salesByPayment[method].revenue += order.total;
      });

      return successResponse({
        period,
        sales: {
          by_day: Object.values(salesByDay).sort((a, b) => a.date.localeCompare(b.date)),
          by_payment_method: Object.values(salesByPayment),
          totals: {
            revenue: periodOrders.reduce((sum, o) => sum + o.total, 0),
            orders: periodOrders.length,
            average: periodOrders.length > 0 ? periodOrders.reduce((sum, o) => sum + o.total, 0) / periodOrders.length : 0,
          },
        },
      });
    }

    if (type === 'products') {
      // Product performance
      const productStats: Record<string, any> = {};
      periodOrders.forEach(order => {
        order.items.forEach(item => {
          if (!productStats[item.productId]) {
            const product = db.getProduct(item.productId);
            productStats[item.productId] = {
              id: item.productId,
              name: item.title,
              units_sold: 0,
              revenue: 0,
              orders: new Set(),
            };
          }
          productStats[item.productId].units_sold += item.quantity;
          productStats[item.productId].revenue += item.price * item.quantity;
          productStats[item.productId].orders.add(order.id);
        });
      });

      const productList = Object.values(productStats).map((p: any) => ({
        ...p,
        order_count: p.orders.size,
        orders: undefined,
      }));

      return successResponse({
        period,
        products: {
          top_by_revenue: productList.sort((a: any, b: any) => b.revenue - a.revenue).slice(0, 10),
          top_by_units: productList.sort((a: any, b: any) => b.units_sold - a.units_sold).slice(0, 10),
        },
      });
    }

    if (type === 'customers') {
      // Customer analytics
      const customerStats = customers.map(c => ({
        id: c.id,
        email: c.email,
        name: `${c.firstName} ${c.lastName}`,
        total_orders: c.totalOrders || 0,
        total_spent: c.totalSpent || 0,
        average_order: (c.totalOrders || 0) > 0 ? (c.totalSpent || 0) / (c.totalOrders || 0) : 0,
        created_at: c.createdAt,
      }));

      return successResponse({
        period,
        customers: {
          total: customers.length,
          new_this_period: customers.filter(c => new Date(c.createdAt) >= startDate).length,
          top_by_spent: customerStats.sort((a, b) => b.total_spent - a.total_spent).slice(0, 10),
          top_by_orders: customerStats.sort((a, b) => b.total_orders - a.total_orders).slice(0, 10),
        },
      });
    }

    return errorResponse('INVALID_TYPE', 'Invalid analytics type', 400);
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to fetch analytics', 500);
  }
}
