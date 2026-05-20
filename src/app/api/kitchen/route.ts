import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const orders = await sql`SELECT * FROM "Order" WHERE status != 'Completed' ORDER BY "createdAt" ASC`;
    return NextResponse.json(orders);
  } catch (e) { return NextResponse.json([]); }
}
export async function PATCH(req: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { id, status, waiterName } = await req.json();
    const updated = await sql`UPDATE "Order" SET status = ${status}, "deliveredBy" = ${waiterName || null} WHERE id = ${id} RETURNING *`;
    return NextResponse.json(updated[0]);
  } catch (e) { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
