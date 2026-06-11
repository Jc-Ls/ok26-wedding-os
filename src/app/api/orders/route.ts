import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import { handleApiError, validateEnvVar } from '@/lib/api-errors';

export async function GET() {
  try {
    const dbUrl = validateEnvVar('DATABASE_URL');
    const sql = neon(dbUrl);
    const orders = await sql`SELECT * FROM "Order" ORDER BY "createdAt" DESC`;
    return NextResponse.json(orders);
  } catch (error: unknown) {
    return handleApiError(error, 'Orders/GET');
  }
}

export async function POST(req: Request) {
  try {
    const dbUrl = validateEnvVar('DATABASE_URL');
    const sql = neon(dbUrl);
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
    
    const createdOrder = order[0];
    
    // Log new order to console for tracking
    console.log(`[NEW ORDER PLACED] ID: ${createdOrder.id} | Table: ${createdOrder.tableNumber} | Guest: ${createdOrder.guestName} | Meal: ${createdOrder.mealName} | Drink: ${createdOrder.drinkName} | Time: ${new Date().toLocaleTimeString()}`);
    if (body.souvenirNudge) {
      console.log(`  └─ 🎁 Souvenir package requested`);
    }
    
    return NextResponse.json(createdOrder);
  } catch (error: unknown) {
    return handleApiError(error, 'Orders/POST');
  }
}
