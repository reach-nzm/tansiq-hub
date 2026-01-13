// Auth API - Session/Profile
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from '@/lib/api/helpers';

// Demo users for validation
const demoUsers: Record<string, any> = {
  'demo@tansiqhub.com': {
    id: 'user_demo',
    email: 'demo@tansiqhub.com',
    firstName: 'Demo',
    lastName: 'User',
    role: 'customer',
  },
  'admin@tansiqhub.com': {
    id: 'user_admin',
    email: 'admin@tansiqhub.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
  },
};

// GET /api/auth/me - Get current user profile
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const userId = request.headers.get('X-User-Id');
    const userEmail = request.headers.get('X-User-Email');

    // In production, validate JWT token
    // For demo, we accept user ID or email in headers
    
    if (userEmail) {
      // Check demo users
      const demoUser = demoUsers[userEmail.toLowerCase()];
      if (demoUser) {
        return successResponse({
          user: {
            id: demoUser.id,
            email: demoUser.email,
            first_name: demoUser.firstName,
            last_name: demoUser.lastName,
            role: demoUser.role,
          },
        });
      }

      // Check customer database
      const customer = db.getCustomerByEmail(userEmail);
      if (customer) {
        const orders = db.getOrders().filter(o => o.customerId === customer.id);
        
        return successResponse({
          user: {
            id: customer.id,
            email: customer.email,
            first_name: customer.firstName,
            last_name: customer.lastName,
            phone: customer.phone,
            role: 'customer',
            addresses: customer.addresses,
            default_address: customer.defaultAddress,
            total_orders: customer.totalOrders,
            total_spent: customer.totalSpent,
            accepts_marketing: customer.acceptsMarketing,
            created_at: customer.createdAt,
          },
          recent_orders: orders.slice(0, 5).map(o => ({
            id: o.id,
            order_number: o.orderNumber,
            total: o.total,
            status: o.financialStatus,
            created_at: o.createdAt,
          })),
        });
      }
    }

    if (userId) {
      const customer = db.getCustomer(userId);
      if (customer) {
        return successResponse({
          user: {
            id: customer.id,
            email: customer.email,
            first_name: customer.firstName,
            last_name: customer.lastName,
            role: 'customer',
          },
        });
      }
    }

    return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to fetch profile', 500);
  }
}

// PUT /api/auth/me - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const userEmail = request.headers.get('X-User-Email');
    const userId = request.headers.get('X-User-Id');
    const body = await request.json();

    if (!userEmail && !userId) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    // Can't update demo users
    if (userEmail && demoUsers[userEmail.toLowerCase()]) {
      return errorResponse('DEMO_USER', 'Cannot update demo user profile', 403);
    }

    let customer;
    if (userEmail) {
      customer = db.getCustomerByEmail(userEmail);
    } else if (userId) {
      customer = db.getCustomer(userId);
    }

    if (!customer) {
      return notFoundResponse('User');
    }

    // Update allowed fields
    const updates: Record<string, unknown> = {};
    if (body.first_name) updates.firstName = body.first_name;
    if (body.last_name) updates.lastName = body.last_name;
    if (body.phone !== undefined) updates.phone = body.phone;
    if (body.accepts_marketing !== undefined) updates.acceptsMarketing = body.accepts_marketing;
    
    // Update default address
    if (body.default_address) {
      updates.defaultAddress = body.default_address;
      // Also add to addresses if not present
      const addressExists = customer.addresses?.some(
        a => a.address1 === body.default_address.address1 && a.zip === body.default_address.zip
      );
      if (!addressExists) {
        updates.addresses = [...(customer.addresses || []), body.default_address];
      }
    }

    // Add new address
    if (body.add_address) {
      updates.addresses = [...(customer.addresses || []), body.add_address];
    }

    const updated = db.updateCustomer(customer.id, updates);

    return successResponse({
      user: {
        id: updated!.id,
        email: updated!.email,
        first_name: updated!.firstName,
        last_name: updated!.lastName,
        phone: updated!.phone,
        addresses: updated!.addresses,
        default_address: updated!.defaultAddress,
        accepts_marketing: updated!.acceptsMarketing,
      },
      message: 'Profile updated successfully',
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to update profile', 500);
  }
}

// POST /api/auth/me - Logout or change password
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action;

    if (action === 'logout') {
      // In production, invalidate the session token
      return successResponse({
        message: 'Logged out successfully',
      });
    }

    if (action === 'change_password') {
      const userEmail = request.headers.get('X-User-Email');
      
      if (!userEmail) {
        return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
      }

      // Demo users can't change password
      if (demoUsers[userEmail.toLowerCase()]) {
        return errorResponse('DEMO_USER', 'Cannot change demo user password', 403);
      }

      const { current_password, new_password } = body;

      if (!current_password || !new_password) {
        return errorResponse('VALIDATION_ERROR', 'Current and new password required', 400);
      }

      if (new_password.length < 6) {
        return errorResponse('VALIDATION_ERROR', 'New password must be at least 6 characters', 400);
      }

      // In production, verify current password and update hash
      return successResponse({
        message: 'Password changed successfully',
      });
    }

    return errorResponse('INVALID_ACTION', 'Invalid action', 400);
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to process request', 500);
  }
}
