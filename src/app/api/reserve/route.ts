import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, vipCode } = body;
    
    if (!name || !phone || !vipCode) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
    }

    const sql = neon(process.env.DATABASE_URL!);

    // 1. Verify the VIP Code exists and is not used
    const checkCode = await sql`SELECT * FROM "VipPass" WHERE code = ${vipCode}`;
    if (checkCode.length === 0) {
      return NextResponse.json({ error: "Invalid VIP Code. Please check your invitation." }, { status: 400 });
    }
    if (checkCode[0].isUsed) {
      return NextResponse.json({ error: "This VIP Code has already been claimed." }, { status: 400 });
    }

    // 2. Mark the Code as Used
    await sql`UPDATE "VipPass" SET "isUsed" = true WHERE code = ${vipCode}`;

    // 3. Save the Guest to the Database (Auto-heal missing columns)
    await sql`CREATE TABLE IF NOT EXISTS "Guest" (id TEXT PRIMARY KEY)`;
    
    await sql`ALTER TABLE "Guest" ADD COLUMN IF NOT EXISTS "fullName" TEXT`;
    await sql`ALTER TABLE "Guest" ADD COLUMN IF NOT EXISTS phone TEXT`;
    await sql`ALTER TABLE "Guest" ADD COLUMN IF NOT EXISTS email TEXT`; 
    await sql`ALTER TABLE "Guest" ADD COLUMN IF NOT EXISTS "ticketId" TEXT`; 
    await sql`ALTER TABLE "Guest" ADD COLUMN IF NOT EXISTS "tableNumber" TEXT`; 
    await sql`ALTER TABLE "Guest" ADD COLUMN IF NOT EXISTS "reservationId" TEXT`; 
    await sql`ALTER TABLE "Guest" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP DEFAULT NOW()`; 
    
    // 🔥 THE FIX: Generate the ID AND the Reservation ID to satisfy Prisma's old rules!
    const newId = crypto.randomUUID();
    const newReservationId = `RES-${Math.floor(Math.random() * 1000000)}`;

    // Safely insert with BOTH IDs included!
    await sql`INSERT INTO "Guest" (id, "fullName", phone, email, "ticketId", "tableNumber", "reservationId") VALUES (${newId}, ${name}, ${phone}, ${email || null}, ${vipCode}, 'Assigned at Door', ${newReservationId})`;

    // 4. Send Email Notification
    if (email && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });
        
        const mailOptions = {
          from: `"M'K26 Royal Gala" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Your VIP Access Pass - M'K26 Wedding",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #06140F; color: #FDFBF7; padding: 30px; border-radius: 10px; border: 2px solid #E5D08F; text-align: center;">
              <h1 style="color: #E5D08F; font-family: Georgia, serif;">M'K26 Royal Gala</h1>
              <p style="font-size: 1.2rem;">Hello <strong>${name}</strong>,</p>
              <p>Your reservation is confirmed! Please present this code at the entrance or use it to order your meals at your table.</p>
              
              <div style="background-color: #111; padding: 20px; border-radius: 10px; border: 1px dashed #E5D08F; margin: 30px 0;">
                <p style="margin: 0; color: #aaa; font-size: 0.9rem;">SECURE VIP CODE</p>
                <h2 style="color: #D4AF37; font-size: 2.5rem; letter-spacing: 4px; margin: 10px 0;">${vipCode}</h2>
                <p style="margin: 5px 0 0 0; color: #aaa; font-size: 0.8rem;">Reservation Ref: ${newReservationId}</p>
              </div>
              <p style="font-size: 0.9rem; color: #aaa;">Please screenshot this email for your records.</p>
            </div>
          `
        };
        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error("Email sending failed, but reservation succeeded:", emailError);
      }
    }

    return NextResponse.json({ success: true, ticketId: vipCode, name });

  } catch (err: unknown) {
    console.error("Reserve API Error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Server connection failed. Try again." }, { status: 500 });
  }
}
