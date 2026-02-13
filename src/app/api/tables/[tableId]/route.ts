import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ tableId: string }> },
) {
  try {
    const { tableId } = await params;
    const id = parseInt(tableId);

    // Check for active orders (not PAID)
    const activeOrders = await prisma.order.count({
      where: { tableId: id, status: { notIn: ['PAID'] } },
    });

    if (activeOrders > 0) {
      return NextResponse.json(
        { error: 'Không thể xóa bàn đang có order' },
        { status: 400 },
      );
    }

    await prisma.table.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/tables/[tableId] error:', error);
    return NextResponse.json({ error: 'Failed to delete table' }, { status: 500 });
  }
}
