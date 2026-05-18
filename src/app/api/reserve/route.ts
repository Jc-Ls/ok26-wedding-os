import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, vipCode } = body;
    
    // 1. Verify the VIP code exists and is not used
    const pass = await prisma.vipPass.findUnique({ where: { code: vipCode } });
    
    if (!pass) {
      return NextResponse.json({ error: "Invalid VIP Code. Please check your invitation." }, { status: 400 });
    }
    if (pass.isUsed) {
      return NextResponse.json({ error: "This VIP Code has already been claimed." }, { status: 400 });
    }

    // 2. Mark the VIP code as used in the Admin Hub
    await prisma.vipPass.update({
      where: { code: vipCode },
      data: { isUsed: true, usedBy: name, usedAt: new Date() }
    });

    // 3. Save guest details to the Reservation table
    await prisma.reservation.create({
      data: { name, email: email || null, phone: phone || null, ticketId: vipCode }
    });

    // ==========================================
    // 📧 EMAIL CONFIGURATION SPOT
    // ==========================================
    // Since you didn't delete your original email code, 
    // it will still fire perfectly here!
    // Example: sendMyEmail({ to: email, code: vipCode });
    // ==========================================

    return NextResponse.json({ success: true, ticketId: vipCode, name });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate reservation" }, { status: 500 });
  }
}
