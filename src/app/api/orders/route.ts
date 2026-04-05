import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Kitchen fetches all active orders, OR Menu fetches single order status
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      // Menu polling for a specific order's status
      const order = await prisma.order.findUnique({ where: { id } });
      return NextResponse.json(order);
    } else {
      // Kitchen Dashboard fetching all active orders
      const orders = await prisma.order.findMany({
        where: { status: { not: 'DISPATCHED' } },
        orderBy: { createdAt: 'asc' }
      });
      return NextResponse.json(orders);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
// POST: Guest submits a new order from the Menu
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newOrder = await prisma.order.create({
      data: {
        tableNumber: body.tableNumber,
        guestName: body.guestName,   // <-- Added this
        guestPhone: body.guestPhone, // <-- Added this
        mealName: body.mealName,
        drinkName: body.drinkName,
        withSalad: body.withSalad,
        status: 'SENT',
      },
    });
    return NextResponse.json({ success: true, orderId: newOrder.id });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}

    return NextResponse.json({ success: true, orderId: newOrder.id });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}

// PATCH: Kitchen updates an order status (Plating -> Dispatched)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const updatedOrder = await prisma.order.update({
      where: { id: body.id },
      data: { status: body.status }
    });
    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
  }
}
