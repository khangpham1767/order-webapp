import { NextResponse } from 'next/server';
import { getKitchenQueueState } from '@/services/kitchen.service';

export async function GET() {
  try {
    const state = await getKitchenQueueState();
    return NextResponse.json(state);
  } catch (error) {
    console.error('GET /api/kitchen error:', error);
    return NextResponse.json({ error: 'Failed to fetch kitchen state' }, { status: 500 });
  }
}
