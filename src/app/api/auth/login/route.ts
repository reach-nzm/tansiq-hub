// Auth API - Login
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import {
  successResponse,
  errorResponse,
  validationError,
  generateId,
  validateRequired,
} from '@/lib/api/helpers';

// Demo users database
const demoUsers = [
  {
    id: 'user_demo',
    email: 'demo@tansiqhub.com',
    password: 'demo123',
    firstName: 'Demo',
    lastName: 'User',
    role: 'customer',
  },
  {
    id: 'user_admin',
    email: 'admin@tansiqhub.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
  },
];

// POST /api/auth/login - Login user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const validationErrors = validateRequired(body, ['email', 'password']);
    if (validationErrors) {
      return validationError(validationErrors);
    }

    const { email, password } = body;

    // Check demo users first
    const demoUser = demoUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (demoUser) {
      // Generate session token
      const token = generateId('sess');
      
      return successResponse({
        user: {
          id: demoUser.id,
          email: demoUser.email,
          first_name: demoUser.firstName,
          last_name: demoUser.lastName,
          role: demoUser.role,
        },
        token,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      });
    }

    // Check customer database
    const customer = db.getCustomerByEmail(email);
    if (customer) {
      // In production, you'd verify password hash
      // For demo, we accept any password for existing customers
      const token = generateId('sess');
      
      return successResponse({
        user: {
          id: customer.id,
          email: customer.email,
          first_name: customer.firstName,
          last_name: customer.lastName,
          role: 'customer',
        },
        token,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    return errorResponse('INVALID_CREDENTIALS', 'Invalid email or password', 401);
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to process login', 500);
  }
}
