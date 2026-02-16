import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, cancelOrder } from '@/services/order.service';
import { emitOrderCancelled } from '../../../../../server/socket/handlers/order.handler';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const { orderId } = await params;
    const order = await getOrderById(parseInt(orderId));
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error('GET /api/orders/[orderId] error:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const { orderId } = await params;
    const result = await cancelOrder(parseInt(orderId));

    try { emitOrderCancelled(result); } catch (e) { console.error('[Socket] emitOrderCancelled failed:', e); }

    return NextResponse.json(result);
  } catch (error) {
    console.error('DELETE /api/orders/[orderId] error:', error);
    const message = error instanceof Error ? error.message : 'Failed to cancel order';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
