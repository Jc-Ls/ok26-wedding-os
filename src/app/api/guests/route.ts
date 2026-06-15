import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST: Bouncer verifies a PIN at the door
export async function POST(request: Request) {
  try {
    const { pin } = await request.json();
    
    if (!pin || typeof pin !== 'string') {
      console.warn('[Concierge/POST] Invalid PIN format received');
      return NextResponse.json({ success: false, message: 'Invalid PIN format.' }, { status: 400 });
    }
    
    // Find the guest by their unique OK26-XXXX pin
    const guest = await prisma.guest.findUnique({
      where: { reservationId: pin }
    });

    if (!guest) {
      console.warn(`[Concierge/POST] Guest not found for PIN: ${pin}`);
      return NextResponse.json({ success: false, message: 'Pass not found in system.' }, { status: 404 });
    }

    if (guest.hasEntered) {
      console.warn(`[Concierge/POST] Duplicate entry attempt for PIN: ${pin}`);
      return NextResponse.json({ success: false, message: 'Pass ALREADY USED. Access Denied.' }, { status: 400 });
    }

    // Mark them as entered so they can't pass the phone to someone outside
    await prisma.guest.update({
      where: { id: guest.id },
      data: { hasEntered: true }
    });

    // Log the check-in event with guest category
    await prisma.checkInLog.create({
      data: {
        guestId: guest.id,
        fullName: guest.fullName,
        reservationId: guest.reservationId,
        guestCategory: guest.guestCategory,
        tableNumber: guest.tableNumber
      }
    });

    console.log(`[Concierge/POST] ✓ Access granted for: ${guest.fullName} (PIN: ${pin}) | Category: ${guest.guestCategory || 'N/A'}`);
    return NextResponse.json({ success: true, message: `Valid Pass: ${guest.fullName}` }, { status: 200 });

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Concierge/POST] Error:`, errorMsg);
    return NextResponse.json({ success: false, message: 'Server error. Please try again.' }, { status: 500 });
  }
}
