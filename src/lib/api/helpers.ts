// API Response Helpers - Shopify-like Response Format

import { NextResponse } from 'next/server';

export interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
}

export function successResponse<T>(data: T, meta?: ApiResponse<T>['meta']) {
  const response: ApiResponse<T> = { data };
  if (meta) response.meta = meta;
  return NextResponse.json(response);
}

export function errorResponse(
  code: string,
  message: string,
  status: number = 400,
  details?: Record<string, string[]>
) {
  const response: ApiResponse<never> = {
    error: { code, message, details },
  };
  return NextResponse.json(response, { status });
}

export function notFoundResponse(resource: string = 'Resource') {
  return errorResponse('NOT_FOUND', `${resource} not found`, 404);
}

export function unauthorizedResponse(message: string = 'Unauthorized') {
  return errorResponse('UNAUTHORIZED', message, 401);
}

export function forbiddenResponse(message: string = 'Forbidden') {
  return errorResponse('FORBIDDEN', message, 403);
}

export function validationError(details: Record<string, string[]>) {
  return errorResponse('VALIDATION_ERROR', 'Validation failed', 422, details);
}

export function serverError(message: string = 'Internal server error') {
  return errorResponse('SERVER_ERROR', message, 500);
}

// Pagination helper
export function paginate<T>(
  items: T[],
  page: number = 1,
  limit: number = 20
): { items: T[]; meta: ApiResponse<T>['meta'] } {
  const total = items.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedItems = items.slice(start, end);

  return {
    items: paginatedItems,
    meta: {
      total,
      page,
      limit,
      hasMore: end < total,
    },
  };
}

// Generate unique ID
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}-${timestamp}${random}` : `${timestamp}${random}`;
}

// Parse query parameters
export function parseQueryParams(url: URL) {
  return {
    page: parseInt(url.searchParams.get('page') || '1'),
    limit: parseInt(url.searchParams.get('limit') || '20'),
    sort: url.searchParams.get('sort') || 'created_at',
    order: (url.searchParams.get('order') || 'desc') as 'asc' | 'desc',
    search: url.searchParams.get('search') || '',
    status: url.searchParams.get('status') || '',
    category: url.searchParams.get('category') || '',
  };
}

// Validate required fields
export function validateRequired(
  data: Record<string, unknown>,
  fields: string[]
): Record<string, string[]> | null {
  const errors: Record<string, string[]> = {};

  for (const field of fields) {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      errors[field] = [`${field} is required`];
    }
  }

  return Object.keys(errors).length > 0 ? errors : null;
}
