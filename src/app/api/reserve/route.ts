import { neon } from '@neondatabase/serverless';
import { NextResponse, type NextRequest } from 'next/server';
import { Resend } from 'resend';
import { validateName, validatePhone, validateEmail, validateVipCode } from '@/lib/validation';
import { getRateLimitKey, checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // Rate limit: max 50 reservations per minute per IP
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const limitKey = getRateLimitKey(ip, 'reserve');
    const rateLimit = checkRateLimit(limitKey, 'reserve');

    if (!rateLimit.allowed) {
      const resetSeconds = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        { error: 'Too many reservations. Please try again later.' },
        { 
          status: 429,
          headers: { 'Retry-After': resetSeconds.toString() }
        }
      );
    }

    const body = await req.json();
    const { name, phone, email, vipCode, guestCategory } = body;
    
    // Validate all required fields
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      return NextResponse.json({ error: nameValidation.error }, { status: 400 });
    }

    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.valid) {
      return NextResponse.json({ error: phoneValidation.error }, { status: 400 });
    }

    const vipValidation = validateVipCode(vipCode);
    if (!vipValidation.valid) {
      return NextResponse.json({ error: vipValidation.error }, { status: 400 });
    }

    // Validate guest category
    if (!guestCategory || !["Bride's Guest", "Groom's Guest"].includes(guestCategory)) {
      return NextResponse.json({ error: "Please select a valid guest category." }, { status: 400 });
    }

    // Email is optional but validate if provided
    let sanitizedEmail: string | null = null;
    if (email) {
      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        return NextResponse.json({ error: emailValidation.error }, { status: 400 });
      }
      sanitizedEmail = emailValidation.value!;
    }

    // Use sanitized values
    const sanitizedName = nameValidation.value!;
    const sanitizedPhone = phoneValidation.value!;
    const sanitizedCode = vipValidation.value!;

    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL not configured');
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const sql = neon(process.env.DATABASE_URL);

    // 1. Verify the VIP Code exists and is not used
    const checkCode = await sql`SELECT * FROM "VipPass" WHERE code = ${sanitizedCode}`;
    if (checkCode.length === 0) {
      return NextResponse.json({ error: "Invalid VIP Code. Please check your invitation." }, { status: 400 });
    }
    if (checkCode[0].isUsed) {
      return NextResponse.json({ error: "This VIP Code has already been claimed." }, { status: 400 });
    }

    // 2. Mark the Code as Used
    await sql`UPDATE "VipPass" SET "isUsed" = true WHERE code = ${sanitizedCode}`;

    // 3. Save the Guest to the Database (Auto-heal missing columns)
    await sql`CREATE TABLE IF NOT EXISTS "Guest" (id TEXT PRIMARY KEY)`;
    
    await sql`ALTER TABLE "Guest" ADD COLUMN IF NOT EXISTS "fullName" TEXT`;
    await sql`ALTER TABLE "Guest" ADD COLUMN IF NOT EXISTS phone TEXT`;
    await sql`ALTER TABLE "Guest" ADD COLUMN IF NOT EXISTS email TEXT`; 
    await sql`ALTER TABLE "Guest" ADD COLUMN IF NOT EXISTS "ticketId" TEXT`; 
    await sql`ALTER TABLE "Guest" ADD COLUMN IF NOT EXISTS "tableNumber" TEXT`; 
    await sql`ALTER TABLE "Guest" ADD COLUMN IF NOT EXISTS "guestCategory" TEXT`; 
    await sql`ALTER TABLE "Guest" ADD COLUMN IF NOT EXISTS "reservationId" TEXT`; 
    await sql`ALTER TABLE "Guest" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP DEFAULT NOW()`; 
    
    // 🔥 THE FIX: Generate the ID AND the Reservation ID to satisfy Prisma's old rules!
    const newId = crypto.randomUUID();
    const newReservationId = `RES-${Math.floor(Math.random() * 1000000)}`;

    // Safely insert with BOTH IDs included (using sanitized values)!
    await sql`INSERT INTO "Guest" (id, "fullName", phone, email, "ticketId", "tableNumber", "guestCategory", "reservationId") VALUES (${newId}, ${sanitizedName}, ${sanitizedPhone}, ${sanitizedEmail}, ${sanitizedCode}, 'Assigned at Door', ${guestCategory}, ${newReservationId})`;

    // 4. Send Email Notification via Resend
    let emailSent = false;
    if (sanitizedEmail && process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        const response = await resend.emails.send({
          from: "M'k26 Royal Concierge <noreply@mk26.com>",
          to: sanitizedEmail,
          subject: "Your VIP Access Pass - M'K26 Wedding",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #06140F; color: #FDFBF7; padding: 30px; border-radius: 10px; border: 2px solid #E5D08F; text-align: center;">
              <h1 style="color: #E5D08F; font-family: Georgia, serif;">M'K26 Royal Gala</h1>
              <p style="font-size: 1.2rem;">Hello <strong>${sanitizedName}</strong>,</p>
              <p>Your reservation is confirmed! Please present this code at the entrance or use it to order your meals at your table.</p>
              
              <div style="background-color: #111; padding: 20px; border-radius: 10px; border: 1px dashed #E5D08F; margin: 30px 0;">
                <p style="margin: 0; color: #aaa; font-size: 0.9rem;">SECURE VIP CODE</p>
                <h2 style="color: #D4AF37; font-size: 2.5rem; letter-spacing: 4px; margin: 10px 0;">${sanitizedCode}</h2>
                <p style="margin: 5px 0 0 0; color: #aaa; font-size: 0.8rem;">Reservation Ref: ${newReservationId}</p>
              </div>
              <p style="font-size: 0.9rem; color: #aaa;">Please screenshot this email for your records.</p>
            </div>
          `
        });
        
        if (response.error) {
          console.error("Resend API error, but reservation succeeded:", response.error);
          emailSent = false;
        } else {
          emailSent = true;
        }
      } catch (emailError) {
        console.error("Email sending failed, but reservation succeeded:", emailError);
        // Don't fail the reservation if email fails - just log it
        emailSent = false;
      }
    }

    return NextResponse.json({ success: true, ticketId: sanitizedCode, name: sanitizedName, guestCategory: guestCategory, emailSent });

  } catch (err: unknown) {
    console.error("Reserve API Error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Server connection failed. Try again." }, { status: 500 });
  }
}
