import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { TableWithStatus } from '@/types/table';

export async function GET() {
  try {
    const tables = await prisma.table.findMany({
      include: {
        orders: {
          where: { status: { notIn: ['PAID'] } },
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { id: true, status: true },
        },
      },
      orderBy: { number: 'asc' },
    });

    const result: TableWithStatus[] = tables.map((table) => ({
      id: table.id,
      number: table.number,
      label: table.label,
      activeOrderId: table.orders[0]?.id ?? null,
      activeOrderStatus: table.orders[0]?.status ?? null,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('GET /api/tables error:', error);
    return NextResponse.json({ error: 'Failed to fetch tables' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { number, label } = await request.json();

    if (!number || !label) {
      return NextResponse.json({ error: 'Số bàn và tên bàn là bắt buộc' }, { status: 400 });
    }

    const existing = await prisma.table.findUnique({ where: { number } });
    if (existing) {
      return NextResponse.json({ error: `Bàn số ${number} đã tồn tại` }, { status: 400 });
    }

    const table = await prisma.table.create({
      data: { number, label },
    });

    return NextResponse.json(table, { status: 201 });
  } catch (error) {
    console.error('POST /api/tables error:', error);
    return NextResponse.json({ error: 'Failed to create table' }, { status: 500 });
  }
}
