// Auth API - Register
import { NextRequest } from 'next/server';
import { db, Customer } from '@/lib/db';
import {
  successResponse,
  errorResponse,
  validationError,
  generateId,
  validateRequired,
} from '@/lib/api/helpers';

// POST /api/auth/register - Register new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const validationErrors = validateRequired(body, ['email', 'password', 'first_name', 'last_name']);
    if (validationErrors) {
      return validationError(validationErrors);
    }

    const { email, password, first_name, last_name, phone, accepts_marketing } = body;

    // Check if email already exists
    const existing = db.getCustomerByEmail(email);
    if (existing) {
      return errorResponse('EMAIL_EXISTS', 'An account with this email already exists', 422);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return validationError({ email: ['Invalid email format'] });
    }

    // Validate password strength
    if (password.length < 6) {
      return validationError({ password: ['Password must be at least 6 characters'] });
    }

    // Create customer
    const customer: Customer = {
      id: generateId('cust'),
      email: email.toLowerCase(),
      firstName: first_name,
      lastName: last_name,
      phone: phone || '',
      addresses: [],
      totalOrders: 0,
      totalSpent: 0,
      tags: ['new_customer'],
      acceptsMarketing: accepts_marketing || false,
      createdAt: new Date().toISOString(),
    };

    const created = db.createCustomer(customer);

    // Generate session token
    const token = generateId('sess');

    return successResponse({
      user: {
        id: created.id,
        email: created.email,
        first_name: created.firstName,
        last_name: created.lastName,
        role: 'customer',
      },
      token,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      message: 'Account created successfully',
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to create account', 500);
  }
}
