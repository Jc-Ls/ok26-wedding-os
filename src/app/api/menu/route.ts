import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import { handleApiError, validateEnvVar } from '@/lib/api-errors';

export async function GET() {
  try {
    const dbUrl = validateEnvVar('DATABASE_URL');
    const sql = neon(dbUrl);
    const items = await sql`SELECT * FROM "MenuItem" ORDER BY "createdAt" DESC`;
    return NextResponse.json(items);
  } catch (error: unknown) {
    console.error('[Menu/GET] Error:', error);
    return NextResponse.json([], { status: 200 }); // Return empty array on error for resilience
  }
}

export async function POST(req: Request) {
  try {
    const dbUrl = validateEnvVar('DATABASE_URL');
    const sql = neon(dbUrl);
    const body = await req.json();
    
    if (!body.name || !body.category) {
      return NextResponse.json({ error: 'Missing required fields: name, category' }, { status: 400 });
    }
    
    const item = await sql`INSERT INTO "MenuItem" (id, name, category, "imageUrl", "isAvailable", "createdAt") VALUES (gen_random_uuid(), ${body.name}, ${body.category}, ${body.imageUrl || null}, true, NOW()) RETURNING *`;
    return NextResponse.json(item[0]);
  } catch (error: unknown) {
    return handleApiError(error, 'Menu/POST');
  }
}
