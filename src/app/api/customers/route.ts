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

    let customers = db.getCustomers() as any[];

    // Filter by IDs
    if (ids && ids.length > 0) {
      customers = customers.filter(c => ids.includes(c.id));
    }

    // Filter by tag
    if (tag) {
      customers = customers.filter(c => c.tags?.includes(tag));
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
        (c.name || `${c.firstName} ${c.lastName}`).toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    customers.sort((a, b) => {
      let comparison = 0;
      const aName = a.name || `${a.firstName} ${a.lastName}`;
      const bName = b.name || `${b.firstName} ${b.lastName}`;
      switch (sort) {
        case 'name':
          comparison = aName.localeCompare(bName);
          break;
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'orders_count':
          comparison = (a.totalOrders || a.ordersCount || 0) - (b.totalOrders || b.ordersCount || 0);
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
    const formattedCustomers = items.map((c: any) => {
      const fullName = c.name || `${c.firstName || ''} ${c.lastName || ''}`.trim();
      return {
        id: c.id,
        email: c.email,
        first_name: c.firstName || fullName.split(' ')[0],
        last_name: c.lastName || fullName.split(' ').slice(1).join(' ') || '',
        phone: c.phone || null,
        created_at: c.createdAt,
        updated_at: c.createdAt,
        orders_count: c.totalOrders || c.ordersCount || 0,
        total_spent: (c.totalSpent || 0).toFixed(2),
        last_order_id: null,
        last_order_date: null,
        tags: c.tags?.join(', ') || '',
        tax_exempt: false,
        accepts_marketing: c.acceptsMarketing || false,
        note: null,
        verified_email: true,
        state: 'enabled',
        addresses: c.addresses?.map((addr: any) => ({
          id: addr.id,
          customer_id: c.id,
          first_name: addr.firstName || addr.first_name,
          last_name: addr.lastName || addr.last_name,
          company: addr.company || null,
          address1: addr.address1,
          address2: addr.address2 || null,
          city: addr.city,
          province: addr.province,
          country: addr.country,
          zip: addr.zip,
          phone: addr.phone || null,
          default: addr.default,
        })) || [],
        default_address: c.defaultAddress || c.addresses?.find((a: any) => a.default) || null,
      };
    });

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
      firstName: body.first_name || '',
      lastName: body.last_name || '',
      name: `${body.first_name || ''} ${body.last_name || ''}`.trim() || 'Customer',
      email: body.email.toLowerCase(),
      phone: body.phone || '',
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
      acceptsMarketing: body.accepts_marketing || false,
      totalOrders: 0,
      totalSpent: 0,
    };

    const created = db.createCustomer(customer);

    return successResponse({
      customer: {
        id: created.id,
        email: created.email,
        first_name: created.firstName,
        last_name: created.lastName,
        created_at: created.createdAt,
      },
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to create customer', 500);
  }
}
