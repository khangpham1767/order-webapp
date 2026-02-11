import { NextRequest, NextResponse } from 'next/server';
import { processPayment, getPaymentByOrderId } from '@/services/payment.service';
import { getOrderById } from '@/services/order.service';
import { emitPaymentCompleted } from '../../../../../server/socket/handlers/payment.handler';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const { orderId } = await params;
    const id = parseInt(orderId);
    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const payment = await processPayment(id);

    try { emitPaymentCompleted(payment, order.tableId); } catch { /* socket not available */ }

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('POST /api/payments/[orderId] error:', error);
    const message = error instanceof Error ? error.message : 'Failed to process payment';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const { orderId } = await params;
    const payment = await getPaymentByOrderId(parseInt(orderId));
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }
    return NextResponse.json(payment);
  } catch (error) {
    console.error('GET /api/payments/[orderId] error:', error);
    return NextResponse.json({ error: 'Failed to fetch payment' }, { status: 500 });
  }
}
