import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const items = await sql`SELECT * FROM "MenuItem" ORDER BY "createdAt" DESC`;
    return NextResponse.json(items);
  } catch (e) { return NextResponse.json([]); }
}
export async function POST(req: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await req.json();
    const item = await sql`INSERT INTO "MenuItem" (id, name, category, "imageUrl", "isAvailable", "createdAt") VALUES (gen_random_uuid(), ${body.name}, ${body.category}, ${body.imageUrl || null}, true, NOW()) RETURNING *`;
    return NextResponse.json(item[0]);
  } catch (e) { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
