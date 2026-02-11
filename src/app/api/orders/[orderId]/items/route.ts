import { NextRequest, NextResponse } from 'next/server';
import { updateOrderItems } from '@/services/order.service';
import { emitOrderUpdated } from '../../../../../../server/socket/handlers/order.handler';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const { orderId } = await params;
    const body = await request.json();
    const order = await updateOrderItems(parseInt(orderId), body);

    try { emitOrderUpdated(order); } catch { /* socket not available */ }

    return NextResponse.json(order);
  } catch (error) {
    console.error('PUT /api/orders/[orderId]/items error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update order items';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
