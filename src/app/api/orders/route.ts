import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  try {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const order = await prisma.order.create({
      data: {
        tableNumber: body.tableNumber,
        guestName: body.guestName,
        mealName: body.mealName,
        drinkName: body.drinkName,
        withSalad: body.withSalad || false,
      }
    });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const updated = await prisma.order.update({
      where: { id: body.id },
      data: { 
        status: body.status,
        deliveredBy: body.deliveredBy // Captures the waiter's name
      }
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
