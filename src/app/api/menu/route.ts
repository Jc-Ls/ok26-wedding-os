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
    console.error('[Menu/GET] Error:', error instanceof Error ? error.message : error);
    return handleApiError(error, 'Menu/GET');
  }
}

export async function POST(req: Request) {
  try {
    const dbUrl = validateEnvVar('DATABASE_URL');
    const sql = neon(dbUrl);
    const body = await req.json();
    
    if (!body.name || !body.category) {
      console.warn('[Menu/POST] Missing required fields:', { name: !!body.name, category: !!body.category });
      return NextResponse.json({ error: 'Missing required fields: name, category' }, { status: 400 });
    }
    
    const item = await sql`INSERT INTO "MenuItem" (id, name, category, "imageUrl", "isAvailable", "createdAt") VALUES (gen_random_uuid(), ${body.name}, ${body.category}, ${body.imageUrl || null}, true, NOW()) RETURNING *`;
    console.log(`[Menu/POST] ✓ New item added: ${body.name} (${body.category})`);
    return NextResponse.json(item[0]);
  } catch (error: unknown) {
    console.error('[Menu/POST] Error:', error instanceof Error ? error.message : error);
    return handleApiError(error, 'Menu/POST');
  }
}
