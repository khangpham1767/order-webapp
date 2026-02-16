import { NextRequest, NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/services/order.service';
import { emitOrderCreated } from '../../../../server/socket/handlers/order.handler';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status') || undefined;
    const orders = await getOrders(status);
    return NextResponse.json(orders);
  } catch (error) {
    console.error('GET /api/orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const order = await createOrder(body);

    try { emitOrderCreated(order); } catch (e) { console.error('[Socket] emitOrderCreated failed:', e); }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('POST /api/orders error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create order';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
