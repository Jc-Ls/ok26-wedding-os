import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const orders = await sql`SELECT * FROM "Order" ORDER BY "createdAt" DESC`;
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await req.json();
    
    // 🔥 AUTO-FIX: Silently add missing columns before placing the order!
    await sql`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "souvenirNudge" BOOLEAN DEFAULT false;`;
    await sql`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "nudgeCount" INTEGER DEFAULT 0;`;
    await sql`ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "deliveredBy" TEXT;`;

    const id = `OK26-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const order = await sql`
      INSERT INTO "Order" (
        id, "tableNumber", "guestName", "ticketId", "mealName", "drinkName", "withSalad", "souvenirNudge", "status", "createdAt"
      )
      VALUES (
        ${id}, 
        ${body.tableNumber || 'VIP'}, 
        ${body.guestName || 'VIP Guest'}, 
        ${body.ticketId || null}, 
        ${body.mealName || null}, 
        ${body.drinkName || null}, 
        ${body.withSalad ? true : false}, 
        ${body.souvenirNudge ? true : false}, 
        'Pending', 
        NOW()
      )
      RETURNING *;
    `;
    return NextResponse.json(order[0]);
  } catch (err: any) {
    console.error("ORDER POST ERROR:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
