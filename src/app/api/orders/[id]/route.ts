import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const sql = neon(process.env.DATABASE_URL!);
    const order = await sql`SELECT * FROM "Order" WHERE id = ${resolvedParams.id}`;
    return NextResponse.json(order[0] || null);
  } catch (e) { return NextResponse.json(null); }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const sql = neon(process.env.DATABASE_URL!);
    await sql`DELETE FROM "Order" WHERE id = ${resolvedParams.id}`;
    return NextResponse.json({ success: true });
  } catch (e) { return NextResponse.json({error: "Failed"}, {status: 500}); }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const sql = neon(process.env.DATABASE_URL!);
    await sql`UPDATE "Order" SET status = 'Completed' WHERE id = ${resolvedParams.id}`;
    return NextResponse.json({ success: true });
  } catch (e) { return NextResponse.json({error: "Failed"}, {status: 500}); }
}
