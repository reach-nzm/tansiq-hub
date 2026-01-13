// Webhooks API - Shopify-like Webhook Management
import { NextRequest } from 'next/server';
import { db, Webhook } from '@/lib/db';
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  validationError,
  generateId,
  validateRequired,
  paginate,
  parseQueryParams,
} from '@/lib/api/helpers';

// Available webhook topics (Shopify-like)
const VALID_TOPICS = [
  'orders/create',
  'orders/updated',
  'orders/paid',
  'orders/fulfilled',
  'orders/cancelled',
  'products/create',
  'products/update',
  'products/delete',
  'customers/create',
  'customers/update',
  'customers/delete',
  'carts/create',
  'carts/update',
  'checkouts/create',
  'checkouts/update',
  'inventory_levels/update',
  'refunds/create',
  'app/uninstalled',
];

// GET /api/webhooks - List all webhooks
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const { page, limit } = parseQueryParams(url);
    const topic = url.searchParams.get('topic');

    let webhooks = db.getWebhooks();

    // Filter by topic
    if (topic) {
      webhooks = webhooks.filter(w => w.topic === topic);
    }

    const { items, meta } = paginate(webhooks, page, limit);

    return successResponse({
      webhooks: items.map(formatWebhook),
      available_topics: VALID_TOPICS,
    }, meta);
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to fetch webhooks', 500);
  }
}

// POST /api/webhooks - Create a new webhook
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle test action
    if (body.action === 'test') {
      const webhook = db.getWebhook(body.webhook_id);
      if (!webhook) {
        return notFoundResponse('Webhook');
      }

      // Simulate sending test webhook
      const testPayload = generateTestPayload(webhook.topic);
      
      // In production, you would actually send the webhook
      // For demo, we'll just simulate success
      return successResponse({
        test_result: {
          success: true,
          webhook_id: webhook.id,
          topic: webhook.topic,
          address: webhook.address,
          response_code: 200,
          response_time_ms: 150,
          payload_sent: testPayload,
        },
        message: 'Test webhook sent successfully',
      });
    }

    // Create new webhook
    const validationErrors = validateRequired(body, ['topic', 'address']);
    if (validationErrors) {
      return validationError(validationErrors);
    }

    // Validate topic
    if (!VALID_TOPICS.includes(body.topic)) {
      return validationError({
        topic: [`Invalid topic. Must be one of: ${VALID_TOPICS.join(', ')}`],
      });
    }

    // Validate URL
    try {
      new URL(body.address);
    } catch {
      return validationError({ address: ['Invalid URL format'] });
    }

    const webhook: Webhook = {
      id: generateId('webhook'),
      topic: body.topic,
      address: body.address,
      format: body.format || 'json',
      active: body.active !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const created = db.createWebhook(webhook);

    return successResponse({
      webhook: formatWebhook(created),
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to create webhook', 500);
  }
}

function formatWebhook(w: Webhook) {
  return {
    id: w.id,
    topic: w.topic,
    address: w.address,
    format: w.format || 'json',
    active: w.active,
    created_at: w.createdAt,
    updated_at: w.updatedAt,
  };
}

function generateTestPayload(topic: string) {
  const basePayload = {
    id: generateId('test'),
    test: true,
    timestamp: new Date().toISOString(),
  };

  switch (topic.split('/')[0]) {
    case 'orders':
      return {
        ...basePayload,
        order_number: 1001,
        email: 'test@example.com',
        total: 99.99,
        currency: 'USD',
      };
    case 'products':
      return {
        ...basePayload,
        title: 'Test Product',
        price: 29.99,
        inventory_quantity: 100,
      };
    case 'customers':
      return {
        ...basePayload,
        email: 'customer@example.com',
        first_name: 'Test',
        last_name: 'Customer',
      };
    default:
      return basePayload;
  }
}
