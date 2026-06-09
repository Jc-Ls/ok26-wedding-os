import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

type OrderActivity = {
  guestName?: string | null;
  status?: string | null;
};

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const orders = await sql`SELECT * FROM "Order" ORDER BY "createdAt" DESC LIMIT 8`;
    const activities = (orders as OrderActivity[]).map((o) => {
      const name = o.guestName || "A VIP Guest";
      if (o.status === 'Completed') return `${name} just enjoyed their royal meal ✨`;
      if (o.status === 'On the Way') return `${name}'s food is on its way 🍽️`;
      if (o.status === 'Preparing') return `The Chef is preparing a masterpiece for ${name} 👨‍🍳`;
      return `${name} just placed a royal order 🔔`;
    });
    return NextResponse.json(activities);
  } catch { return NextResponse.json([]); }
}
