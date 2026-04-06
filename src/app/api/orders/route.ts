import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    const order = await prisma.order.findUnique({ where: { id } });
    return NextResponse.json(order);
  }
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newOrder = await prisma.order.create({
    data: {
      tableNumber: body.tableNumber,
      guestName: body.guestName,
      guestPhone: body.guestPhone,
      mealName: body.mealName,
      drinkName: body.drinkName,
      withSalad: body.withSalad,
      status: 'SENT',
    },
  });
  return NextResponse.json({ success: true, orderId: newOrder.id });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const updatedOrder = await prisma.order.update({
    where: { id: body.id },
    data: { status: body.status },
  });
  return NextResponse.json({ success: true, order: updatedOrder });
}
