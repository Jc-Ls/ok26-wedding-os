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
      mealName: body.mealName,
      drinkName: body.drinkName,
      withSalad: body.withSalad || false,
      status: 'SENT',
    },
  });
  return NextResponse.json({ success: true, orderId: newOrder.id });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const dataToUpdate: any = {};
  if (body.status) dataToUpdate.status = body.status;
  if (body.tableNumber) dataToUpdate.tableNumber = body.tableNumber;
  if (body.guestName) dataToUpdate.guestName = body.guestName;

  const updatedOrder = await prisma.order.update({
    where: { id: body.id },
    data: dataToUpdate,
  });
  return NextResponse.json({ success: true, order: updatedOrder });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const wipeAll = searchParams.get('wipeAll');

  if (wipeAll === 'true') {
    await prisma.order.deleteMany({});
    return NextResponse.json({ success: true, message: 'Database Wiped' });
  }

  if (id) {
    await prisma.order.delete({ where: { id } });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false }, { status: 400 });
}
