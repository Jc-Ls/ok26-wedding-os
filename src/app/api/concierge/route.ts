import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  const requests = await prisma.conciergeRequest.findMany({ 
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'desc' } 
  });
  return NextResponse.json(requests);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newRequest = await prisma.conciergeRequest.create({
    data: {
      tableNumber: body.tableNumber,
      guestName: body.guestName,
      requestType: body.requestType,
      status: 'PENDING',
    },
  });
  return NextResponse.json({ success: true, request: newRequest });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const updated = await prisma.conciergeRequest.update({
    where: { id: body.id },
    data: { status: body.status },
  });
  return NextResponse.json({ success: true, request: updated });
}
