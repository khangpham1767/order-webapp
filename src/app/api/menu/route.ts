import { NextRequest, NextResponse } from 'next/server';
import { getMenuItems, createMenuItem } from '@/services/menu.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const activeOnly = searchParams.get('all') !== 'true';
    const items = await getMenuItems(activeOnly);
    return NextResponse.json(items);
  } catch (error) {
    console.error('GET /api/menu error:', error);
    return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const item = await createMenuItem(body);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('POST /api/menu error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create menu item';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
