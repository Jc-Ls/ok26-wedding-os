import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import { handleApiError, validateEnvVar } from '@/lib/api-errors';

export async function GET() {
  try {
    const dbUrl = validateEnvVar('DATABASE_URL');
    const sql = neon(dbUrl);
    const orders = await sql`SELECT * FROM "Order" WHERE status != 'Completed' ORDER BY "createdAt" ASC`;
    
    // Log active orders for kitchen dashboard monitoring
    if (orders.length > 0) {
      console.log(`[KITCHEN DASHBOARD] Active Orders Count: ${orders.length}`);
      orders.forEach((order: any) => {
        console.log(`  ├─ Table: ${order.tableNumber} | Meal: ${order.mealName} | Status: ${order.status} | Time: ${order.createdAt}`);
      });
    } else {
      console.log(`[KITCHEN DASHBOARD] No active orders`);
    }
    
    return NextResponse.json(orders);
  } catch (error: unknown) {
    return handleApiError(error, 'Kitchen/GET');
  }
}

export async function PATCH(req: Request) {
  try {
    const dbUrl = validateEnvVar('DATABASE_URL');
    const sql = neon(dbUrl);
    const body = await req.json();
    
    const { id, status, waiterName } = body;
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields: id, status' }, { status: 400 });
    }
    
    const updated = await sql`UPDATE "Order" SET status = ${status}, "deliveredBy" = ${waiterName || null} WHERE id = ${id} RETURNING *`;
    
    if (updated.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    // Log order status update for audit trail
    const order = updated[0];
    console.log(`[KITCHEN ORDER UPDATE] ID: ${id} | Table: ${order.tableNumber} | Status: ${status} | Delivered By: ${waiterName || 'None'}`);
    
    return NextResponse.json(order);
  } catch (error: unknown) {
    return handleApiError(error, 'Kitchen/PATCH');
  }
}
