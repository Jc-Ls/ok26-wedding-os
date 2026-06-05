import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// GET: For the Admin Hub to see all reservations
export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const guests = await sql`SELECT * FROM "Guest" ORDER BY "createdAt" DESC`;
    return NextResponse.json(guests);
  } catch (e) { return NextResponse.json([]); }
}

// POST: For Guests submitting the RSVP form
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, tableNumber } = body;
    const sql = neon(process.env.DATABASE_URL!);

    // 1. Find an unused VIP Code
    const availableCodes = await sql`SELECT * FROM "VipPass" WHERE "isUsed" = false LIMIT 1`;
    if (availableCodes.length === 0) {
      return NextResponse.json({ error: "No VIP codes left! Contact Admin." }, { status: 400 });
    }
    const vipCode = availableCodes[0].code;

    // 2. Mark the code as used
    await sql`UPDATE "VipPass" SET "isUsed" = true WHERE code = ${vipCode}`;

    // 3. Save the guest in the database
    // Note: Creating table safely if it doesn't exist
    await sql`CREATE TABLE IF NOT EXISTS "Guest" (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, "fullName" TEXT, email TEXT, "ticketId" TEXT, "tableNumber" TEXT, "createdAt" TIMESTAMP DEFAULT NOW())`;
    await sql`INSERT INTO "Guest" ("fullName", email, "ticketId", "tableNumber") VALUES (${name}, ${email}, ${vipCode}, ${tableNumber || 'TBD'})`;

    // 4. Send the Email via Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // e.g., yourgmail@gmail.com
        pass: process.env.EMAIL_PASS  // The 16-letter Google App Password
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

    return NextResponse.json({ success: true, vipCode });
  } catch (err: any) {
    console.error("RSVP Error:", err.message);
    return NextResponse.json({ error: "Failed to process reservation" }, { status: 500 });
  }
}
