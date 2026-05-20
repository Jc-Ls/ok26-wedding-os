import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    // Forcefully inject the missing Wow Factor columns into your live Neon DB
    await sql`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "souvenirNudge" BOOLEAN DEFAULT false;`;
    await sql`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "nudgeCount" INTEGER DEFAULT 0;`;
    await sql`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "deliveredBy" TEXT;`;

    return NextResponse.json({ 
      success: true, 
      message: "Database patched successfully! The Wow Factors are now securely in the database." 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
