// Single Webhook API
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from '@/lib/api/helpers';

// GET /api/webhooks/[id] - Get single webhook
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const webhook = db.getWebhook(id);

    if (!webhook) {
      return notFoundResponse('Webhook');
    }

    return successResponse({
      webhook: {
        id: webhook.id,
        topic: webhook.topic,
        address: webhook.address,
        format: webhook.format || 'json',
        active: webhook.active,
        created_at: webhook.createdAt,
        updated_at: webhook.updatedAt,
      },
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to fetch webhook', 500);
  }
}

// PUT /api/webhooks/[id] - Update webhook
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = db.getWebhook(id);
    if (!existing) {
      return notFoundResponse('Webhook');
    }

    const updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (body.address !== undefined) {
      // Validate URL
      try {
        new URL(body.address);
        updates.address = body.address;
      } catch {
        return errorResponse('VALIDATION_ERROR', 'Invalid URL format', 400);
      }
    }

    if (body.format !== undefined) updates.format = body.format;
    if (body.active !== undefined) updates.active = body.active;

    const updated = db.updateWebhook(id, updates);

    return successResponse({
      webhook: {
        id: updated!.id,
        topic: updated!.topic,
        address: updated!.address,
        format: updated!.format || 'json',
        active: updated!.active,
        created_at: updated!.createdAt,
        updated_at: updated!.updatedAt,
      },
    });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to update webhook', 500);
  }
}

// DELETE /api/webhooks/[id] - Delete webhook
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = db.getWebhook(id);

    if (!existing) {
      return notFoundResponse('Webhook');
    }

    db.deleteWebhook(id);

    return successResponse({ deleted: true, id });
  } catch (error) {
    return errorResponse('SERVER_ERROR', 'Failed to delete webhook', 500);
  }
}
