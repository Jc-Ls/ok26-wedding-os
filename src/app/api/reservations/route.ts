import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// GET: For the Admin Hub to see all reservations
export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const guests = await sql`SELECT * FROM "Guest" ORDER BY "createdAt" DESC`;
    return NextResponse.json(guests);
  } catch (error) {
    console.error('[Reservations/GET] Error fetching guest list:', error instanceof Error ? error.message : error);
    return NextResponse.json([], { status: 500 });
  }
}

// POST: For Guests submitting the RSVP form
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, tableNumber } = body;
    
    if (!name || !email) {
      console.warn('[Reservations/POST] Missing required fields:', { name: !!name, email: !!email });
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }
    
    const sql = neon(process.env.DATABASE_URL!);

    // 1. Find an unused VIP Code
    const availableCodes = await sql`SELECT * FROM "VipPass" WHERE "isUsed" = false LIMIT 1`;
    if (availableCodes.length === 0) {
      console.warn('[Reservations/POST] No VIP codes available');
      return NextResponse.json({ error: "No VIP codes left! Contact Admin." }, { status: 400 });
    }
    const vipCode = availableCodes[0].code;

    // 2. Mark the code as used
    await sql`UPDATE "VipPass" SET "isUsed" = true WHERE code = ${vipCode}`;

    // 3. Save the guest in the database
    await sql`CREATE TABLE IF NOT EXISTS "Guest" (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, "fullName" TEXT, email TEXT, "ticketId" TEXT, "tableNumber" TEXT, "createdAt" TIMESTAMP DEFAULT NOW())`;
    await sql`INSERT INTO "Guest" ("fullName", email, "ticketId", "tableNumber") VALUES (${name}, ${email}, ${vipCode}, ${tableNumber || 'TBD'})`;

    // 4. Send the Email via Nodemailer
    let emailSent = false;
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        const mailOptions = {
          from: `"M'K26 Royal Gala" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Your VIP Access Pass - M'K26 Wedding",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #06140F; color: #FDFBF7; padding: 30px; border-radius: 10px; border: 2px solid #E5D08F; text-align: center;">
              <h1 style="color: #E5D08F; font-family: Georgia, serif;">M'K26 Royal Gala</h1>
              <p style="font-size: 1.2rem;">Hello <strong>${name}</strong>,</p>
              <p>Your reservation is confirmed. Please present this code at the entrance or use it to order your meals at your table.</p>
              
              <div style="background-color: #111; padding: 20px; border-radius: 10px; border: 1px dashed #E5D08F; margin: 30px 0;">
                <p style="margin: 0; color: #aaa; font-size: 0.9rem;">YOUR VIP CODE</p>
                <h2 style="color: #D4AF37; font-size: 2.5rem; letter-spacing: 4px; margin: 10px 0;">${vipCode}</h2>
                <p style="margin: 0; color: #aaa; font-size: 0.9rem;">Table Assignment: <strong>${tableNumber || 'Assigned at Door'}</strong></p>
              </div>
              
              <p style="font-size: 0.9rem; color: #aaa;">Please screenshot this email for your records.</p>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        emailSent = true;
        console.log(`[Reservations/POST] ✓ Email sent to ${email} with code ${vipCode}`);
      } catch (emailError) {
        console.error(`[Reservations/POST] Email sending failed for ${email}:`, emailError instanceof Error ? emailError.message : emailError);
      }
    }

    return NextResponse.json({ success: true, vipCode, emailSent });
  } catch (err: unknown) {
    console.error("[Reservations/POST] Error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Failed to process reservation" }, { status: 500 });
  }
}
