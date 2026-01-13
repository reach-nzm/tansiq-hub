// Customers API - Shopify-like Customer Management
import { NextRequest } from 'next/server';
import { db, Customer } from '@/lib/db';
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

// GET /api/customers - List all customers
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const { page, limit, sort, order, search } = parseQueryParams(url);
    const ids = url.searchParams.get('ids')?.split(',');
    const createdAtMin = url.searchParams.get('created_at_min');
    const createdAtMax = url.searchParams.get('created_at_max');
    const tag = url.searchParams.get('tag');

    let customers = db.getCustomers();

    // Filter by IDs
    if (ids && ids.length > 0) {
      customers = customers.filter(c => ids.includes(c.id));
    }

    // Filter by tag
    if (tag) {
      customers = customers.filter(c => c.tags.includes(tag));
    }

    // Filter by date range
    if (createdAtMin) {
      const minDate = new Date(createdAtMin);
      customers = customers.filter(c => new Date(c.createdAt) >= minDate);
    }
    if (createdAtMax) {
      const maxDate = new Date(createdAtMax);
      customers = customers.filter(c => new Date(c.createdAt) <= maxDate);
    }

    // Search by name or email
    if (search) {
      const searchLower = search.toLowerCase();
      customers = customers.filter(c =>
        c.name.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    customers.sort((a, b) => {
      let comparison = 0;
      switch (sort) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'orders_count':
          comparison = (a.ordersCount || 0) - (b.ordersCount || 0);
          break;
        case 'total_spent':
          comparison = (a.totalSpent || 0) - (b.totalSpent || 0);
          break;
        case 'created_at':
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return order === 'desc' ? -comparison : comparison;
    });

    // Paginate
    const { items, meta } = paginate(customers, page, limit);

    // Format customers for response
    const formattedCustomers = items.map(c => ({
      id: c.id,
      email: c.email,
      first_name: c.name.split(' ')[0],
      last_name: c.name.split(' ').slice(1).join(' ') || '',
      phone: c.phone || null,
      created_at: c.createdAt,
      updated_at: c.createdAt,
      orders_count: c.ordersCount || 0,
      total_spent: (c.totalSpent || 0).toFixed(2),
      last_order_id: c.lastOrderId || null,
      last_order_date: c.lastOrderDate || null,
      tags: c.tags.join(', '),
      tax_exempt: c.taxExempt,
      accepts_marketing: c.acceptsMarketing,
      note: c.note || null,
      verified_email: true,
      state: 'enabled',
      addresses: c.addresses.map(addr => ({
        id: addr.id,
        customer_id: c.id,
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
      default_address: c.addresses.find(a => a.default) || null,
    }));

    return successResponse({ customers: formattedCustomers }, meta);
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to fetch customers', 500);
  }
}

// POST /api/customers - Create a new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const validationErrors = validateRequired(body, ['email']);
    if (validationErrors) {
      return validationError(validationErrors);
    }

    // Check if customer already exists
    const existing = db.getCustomerByEmail(body.email);
    if (existing) {
      return errorResponse('DUPLICATE_ERROR', 'A customer with this email already exists', 422);
    }

    const customer: Customer = {
      id: generateId('cust'),
      name: `${body.first_name || ''} ${body.last_name || ''}`.trim() || 'Customer',
      email: body.email.toLowerCase(),
      phone: body.phone,
      role: 'customer',
      createdAt: new Date().toISOString(),
      addresses: body.addresses?.map((addr: Record<string, string>, index: number) => ({
        id: `addr-${generateId()}`,
        firstName: addr.first_name || body.first_name || '',
        lastName: addr.last_name || body.last_name || '',
        company: addr.company,
        address1: addr.address1 || '',
        address2: addr.address2,
        city: addr.city || '',
        province: addr.province || '',
        country: addr.country || 'United States',
        zip: addr.zip || '',
        phone: addr.phone,
        default: index === 0,
      })) || [],
      tags: body.tags ? body.tags.split(',').map((t: string) => t.trim()) : [],
      note: body.note,
      taxExempt: body.tax_exempt || false,
      acceptsMarketing: body.accepts_marketing || false,
      ordersCount: 0,
      totalSpent: 0,
    };

    const created = db.createCustomer(customer);

    return successResponse({
      customer: {
        id: created.id,
        email: created.email,
        first_name: created.name.split(' ')[0],
        last_name: created.name.split(' ').slice(1).join(' '),
        created_at: created.createdAt,
      },
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to create customer', 500);
  }
}
