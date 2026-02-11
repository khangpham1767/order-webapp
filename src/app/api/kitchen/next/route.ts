import { NextResponse } from 'next/server';
import { startNextOrder, getKitchenQueueState } from '@/services/kitchen.service';
import { emitKitchenOrderStarted, emitKitchenQueueUpdated } from '../../../../../server/socket/handlers/kitchen.handler';

export async function POST() {
  try {
    const order = await startNextOrder();
    if (!order) {
      return NextResponse.json({ message: 'No orders in queue' }, { status: 404 });
    }

    try {
      emitKitchenOrderStarted(order);
      const state = await getKitchenQueueState();
      emitKitchenQueueUpdated(state);
    } catch { /* socket not available */ }

    return NextResponse.json(order);
  } catch (error) {
    console.error('POST /api/kitchen/next error:', error);
    const message = error instanceof Error ? error.message : 'Failed to start next order';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
