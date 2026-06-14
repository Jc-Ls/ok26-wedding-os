import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { count = 300 } = await request.json();
    const sql = neon(process.env.DATABASE_URL!);
    
    const characters = 'ABCDEFGHJKMNPQRSTUVWXYZ123456789';
    const codesGenerated = [];
    let generated = 0;
    
    // Generate unique codes
    for (let i = 0; i < Math.min(count, 2000); i++) {
      let randomPart = '';
      for (let j = 0; j < 5; j++) {
        randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      const code = `MK26-${randomPart}`;
      codesGenerated.push(code);
      
      try {
        await sql`INSERT INTO "VipPass" (id, code, "isUsed", "createdAt") VALUES (gen_random_uuid(), ${code}, false, NOW()) ON CONFLICT (code) DO NOTHING`;
        generated++;
      } catch (e) {
        // Skip on conflict, try next
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      count: generated,
      codes: codesGenerated
    });
  } catch (error) {
    console.error("VIP Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate codes" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    // Fetch all unused codes
    const allCodes = await sql`SELECT code FROM "VipPass" WHERE "isUsed" = false ORDER BY "createdAt" DESC`;
    
    const codeList = allCodes.map(c => c.code);
    
    return NextResponse.json({
      success: true,
      total: codeList.length,
      codes: codeList
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch codes" }, { status: 500 });
  }
}
