import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { count } = await request.json();
    const codes = [];
    for (let i = 0; i < count; i++) {
      const code = `MK26-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      codes.push({ code });
    }
    await prisma.vipPass.createMany({ data: codes, skipDuplicates: true });
    return NextResponse.json({ success: true, count });
  } catch (err) {
    return NextResponse.json({ error: "Failed to generate" }, { status: 500 });
  }
}
