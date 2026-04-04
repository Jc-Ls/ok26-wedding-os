import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST: Bouncer verifies a PIN at the door
export async function POST(request: Request) {
  try {
    const { pin } = await request.json();
    
    // Find the guest by their unique OK26-XXXX pin
    const guest = await prisma.guest.findUnique({
      where: { reservationId: pin }
    });

    if (!guest) {
      return NextResponse.json({ success: false, message: 'Pass not found in system.' });
    }

    if (guest.hasEntered) {
      return NextResponse.json({ success: false, message: 'Pass ALREADY USED. Access Denied.' });
    }

    // Mark them as entered so they can't pass the phone to someone outside
    await prisma.guest.update({
      where: { id: guest.id },
      data: { hasEntered: true }
    });

    return NextResponse.json({ success: true, message: `Valid Pass: ${guest.fullName}` });

  } catch (error) {
    return NextResponse.json({ success: false, message: 'Database Error' }, { status: 500 });
  }
}
