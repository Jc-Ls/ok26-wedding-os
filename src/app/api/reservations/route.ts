import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const guests = await sql`SELECT * FROM "Guest" ORDER BY "createdAt" DESC`;
    return NextResponse.json(guests);
  } catch (e) { return NextResponse.json([]); }
}
