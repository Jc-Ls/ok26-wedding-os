import { NextResponse, type NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getRateLimitKey, checkRateLimit } from '@/lib/rate-limit';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
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

    // Generate 300 unique codes
    for (let i = 0; i < 300; i++) {
      let randomPart = '';
      for (let j = 0; j < 5; j++) {
        randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      newCodes.push({ code: `OK26-${randomPart}` });
    }

    // Securely inject them all into the Neon Database at once
    await prisma.vipPass.createMany({
      data: newCodes,
      skipDuplicates: true, // Just in case a random code accidentally duplicates
    });

    // Extract just the text to make it easy for you to copy
    const plainTextList = newCodes.map(c => c.code);

    return NextResponse.json({
      success: true,
      message: "300 VIP codes generated and locked into the vault!",
      total: plainTextList.length,
      codes: plainTextList,
      rateLimitRemaining: rateLimit.remaining
    });
    
  } catch (error) {
    console.error("Generator Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}