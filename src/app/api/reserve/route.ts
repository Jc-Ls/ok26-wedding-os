import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, passcode } = body;

    // 1. Verify Passcode
    if (passcode !== "OK26-VIP") {
      return NextResponse.json({ success: false, error: "Invalid passcode" }, { status: 401 });
    }

    // 2. Generate Unique Ticket ID
    const ticketId = `OK26-${Math.floor(1000 + Math.random() * 9000)}`;

    // 3. Save to Neon Database
    await prisma.reservation.create({
      data: {
        ticketId,
        name,
        email: email || null,
        phone: phone || null,
      }
    });

    // 4. Nodemailer (Only fires if email was provided)
    if (email) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const mailOptions = {
        from: `"The Olowojaré Gala" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "VIP Access Granted: The Olowojaré Gala",
        html: `
          <div style="font-family: sans-serif; text-align: center; color: #0A2318; padding: 20px;">
            <h1 style="color: #C7A951;">O'K26</h1>
            <h2>Access Granted, ${name}</h2>
            <p>Your VIP reservation is confirmed. Please present this Ticket ID at the entrance.</p>
            <div style="margin: 20px auto; padding: 15px; border: 2px dashed #C7A951; display: inline-block;">
              <strong style="font-size: 24px; letter-spacing: 2px;">${ticketId}</strong>
            </div>
            <p>We look forward to celebrating with you.</p>
          </div>
        `
      };
      await transporter.sendMail(mailOptions);
    }

    // 5. Send Success Response back to UI
    return NextResponse.json({ success: true, ticketId });
    
  } catch (error) {
    console.error("Reservation Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}