import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  try {
    const requests = await prisma.conciergeRequest.findMany({ 
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' } 
    });
    return NextResponse.json(requests);
  } catch (error) {
    console.error('[Concierge/GET] Error fetching requests:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Failed to fetch concierge requests' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tableNumber, guestName, requestType } = body;
    
    if (!tableNumber || !guestName || !requestType) {
      console.warn('[Concierge/POST] Missing required fields:', { tableNumber: !!tableNumber, guestName: !!guestName, requestType: !!requestType });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const newRequest = await prisma.conciergeRequest.create({
      data: {
        tableNumber,
        guestName,
        requestType,
        status: 'PENDING',
      },
    });
    console.log('[Concierge/POST] Request created:', { id: newRequest.id, requestType });
    return NextResponse.json({ success: true, request: newRequest });
  } catch (error) {
    console.error('[Concierge/POST] Error creating request:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Failed to create concierge request' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;
    
    if (!id || !status) {
      console.warn('[Concierge/PATCH] Missing required fields:', { id: !!id, status: !!status });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const updated = await prisma.conciergeRequest.update({
      where: { id },
      data: { status },
    });
    console.log('[Concierge/PATCH] Request updated:', { id, newStatus: status });
    return NextResponse.json({ success: true, request: updated });
  } catch (error) {
    console.error('[Concierge/PATCH] Error updating request:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Failed to update concierge request' }, { status: 500 });
  }
}
