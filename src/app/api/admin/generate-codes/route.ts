import { NextResponse, type NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getRateLimitKey, checkRateLimit } from '@/lib/rate-limit';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const count = Math.min(body.count || 300, 2000); // Max 2000 per request

    // Extract client IP from request headers
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    
    // Check rate limit: max 100 code generations per minute per IP
    const limitKey = getRateLimitKey(ip, 'generate-codes');
    const rateLimit = checkRateLimit(limitKey, 'generate-codes');

    if (!rateLimit.allowed) {
      const resetSeconds = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        { 
          error: 'Too many code generation requests. Please try again later.',
          retryAfter: resetSeconds 
        },
        { 
          status: 429,
          headers: { 'Retry-After': resetSeconds.toString() }
        }
      );
    }

    const newCodes = [];
    // We use characters that are easy to read (removed O, 0, I, L to avoid confusion)
    const characters = 'ABCDEFGHJKMNPQRSTUVWXYZ123456789'; 

    // Generate unique codes
    for (let i = 0; i < count; i++) {
      let randomPart = '';
      for (let j = 0; j < 5; j++) {
        randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      newCodes.push(`MK26-${randomPart}`);
    }

    // Securely inject them all into the Neon Database at once using raw SQL for better control
    const queryStr = `
      INSERT INTO "VipPass" (code, "isUsed", "createdAt")
      VALUES ${newCodes.map((_, idx) => `($${idx + 1}, false, NOW())`).join(', ')}
      ON CONFLICT (code) DO NOTHING;
    `;
    
    await prisma.$executeRawUnsafe(queryStr, ...newCodes);

    // Extract the plaintext list
    const plainTextList = newCodes;

    return NextResponse.json({
      success: true,
      message: `${count} VIP codes generated and locked into the vault!`,
      total: plainTextList.length,
      codes: plainTextList,
      rateLimitRemaining: rateLimit.remaining
    });
    
  } catch (error) {
    console.error("Generator Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Fetch all unused codes from database
    const allCodes = await prisma.vipPass.findMany({
      where: { isUsed: false },
      select: { code: true },
      orderBy: { createdAt: 'desc' }
    });

    const codeList = allCodes.map(c => c.code);

    return NextResponse.json({
      success: true,
      total: codeList.length,
      codes: codeList
    });
    
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}