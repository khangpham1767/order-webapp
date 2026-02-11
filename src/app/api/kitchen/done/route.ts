import { NextResponse } from 'next/server';
import { completeCurrentOrder, getKitchenQueueState } from '@/services/kitchen.service';
import {
  emitKitchenOrderDone,
  emitKitchenOrderStarted,
  emitKitchenQueueUpdated,
} from '../../../../../server/socket/handlers/kitchen.handler';

export async function POST() {
  try {
    const { completedOrder, nextOrder } = await completeCurrentOrder();

    try {
      emitKitchenOrderDone(completedOrder);
      if (nextOrder) {
        emitKitchenOrderStarted(nextOrder);
      }
      const state = await getKitchenQueueState();
      emitKitchenQueueUpdated(state);
    } catch { /* socket not available */ }

    return NextResponse.json({ completedOrder, nextOrder });
  } catch (error) {
    console.error('POST /api/kitchen/done error:', error);
    const message = error instanceof Error ? error.message : 'Failed to complete order';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
