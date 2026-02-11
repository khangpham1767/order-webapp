import { NextRequest, NextResponse } from 'next/server';
import { getMenuItemById, updateMenuItem, toggleMenuItem } from '@/services/menu.service';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> },
) {
  try {
    const { itemId } = await params;
    const item = await getMenuItemById(parseInt(itemId));
    if (!item) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    console.error('GET /api/menu/[itemId] error:', error);
    return NextResponse.json({ error: 'Failed to fetch menu item' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> },
) {
  try {
    const { itemId } = await params;
    const body = await request.json();
    const item = await updateMenuItem(parseInt(itemId), body);
    return NextResponse.json(item);
  } catch (error) {
    console.error('PUT /api/menu/[itemId] error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update menu item';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> },
) {
  try {
    const { itemId } = await params;
    const item = await toggleMenuItem(parseInt(itemId));
    return NextResponse.json(item);
  } catch (error) {
    console.error('PATCH /api/menu/[itemId] error:', error);
    const message = error instanceof Error ? error.message : 'Failed to toggle menu item';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
