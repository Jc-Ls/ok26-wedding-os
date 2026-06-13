import { neon } from '@neondatabase/serverless';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    
    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const sql = neon(process.env.DATABASE_URL);

    // Check if code exists
    const result = await sql`SELECT * FROM "VipPass" WHERE code = ${code.trim().toUpperCase()}`;

    if (result.length === 0) {
      // Check if maybe they typed it with different case
      const allCodes = await sql`SELECT code, "isUsed" FROM "VipPass" LIMIT 5`;
      const totalResult = await sql`SELECT COUNT(*) as total FROM "VipPass"`;
      return NextResponse.json({
        status: 'NOT_FOUND',
        message: 'Code not found in database',
        inputCode: code,
        totalCodesInDB: totalResult[0].total,
        sampleCodes: allCodes
      });
    }

    const codeRecord = result[0];
    return NextResponse.json({
      status: 'FOUND',
      code: codeRecord.code,
      isUsed: codeRecord.isUsed,
      usedBy: codeRecord.usedBy,
      createdAt: codeRecord.createdAt,
      message: codeRecord.isUsed ? 'Code already used' : 'Code is valid and available'
    });

  } catch (err) {
    console.error('Debug check error:', err);
    return NextResponse.json({ error: 'Server error', details: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
}

// GET endpoint to check total codes
export async function GET(req: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const sql = neon(process.env.DATABASE_URL);

    const totalCount = await sql`SELECT COUNT(*) as total FROM "VipPass"`;
    const usedCount = await sql`SELECT COUNT(*) as total FROM "VipPass" WHERE "isUsed" = true`;
    const sampleCodes = await sql`SELECT code, "isUsed" FROM "VipPass" LIMIT 10`;

    return NextResponse.json({
      totalCodes: totalCount[0].total,
      usedCodes: usedCount[0].total,
      availableCodes: totalCount[0].total - usedCount[0].total,
      sampleUnusedCodes: sampleCodes.filter((c: any) => !c.isUsed),
      sampleUsedCodes: sampleCodes.filter((c: any) => c.isUsed)
    });

  } catch (err) {
    console.error('Debug error:', err);
    return NextResponse.json({ error: 'Server error', details: err instanceof Error ? err.message : 'Unknown' }, { status: 500 });
  }
}
