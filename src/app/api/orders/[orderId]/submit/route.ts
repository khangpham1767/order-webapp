import { NextRequest, NextResponse } from 'next/server';
import { submitOrder } from '@/services/order.service';
import { emitOrderSubmitted } from '../../../../../../server/socket/handlers/order.handler';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const { orderId } = await params;
    const body = await request.json().catch(() => ({}));
    const frontInsert = body.frontInsert === true;
    const order = await submitOrder(parseInt(orderId), frontInsert);

    try { emitOrderSubmitted(order); } catch { /* socket not available */ }

    return NextResponse.json(order);
  } catch (error) {
    console.error('POST /api/orders/[orderId]/submit error:', error);
    const message = error instanceof Error ? error.message : 'Failed to submit order';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
