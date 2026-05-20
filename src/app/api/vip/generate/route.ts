import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { count } = await request.json();
    const sql = neon(process.env.DATABASE_URL!);
    
    let generated = 0;
    for (let i = 0; i < count; i++) {
      const code = `MK26-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      await sql`INSERT INTO "VipPass" (id, code, "isUsed", "createdAt") VALUES (gen_random_uuid(), ${code}, false, NOW()) ON CONFLICT (code) DO NOTHING`;
      generated++;
    }
    return NextResponse.json({ success: true, count: generated });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to generate" }, { status: 500 });
  }
}
