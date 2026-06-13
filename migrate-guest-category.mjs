// Quick migration script - adds guestCategory column safely
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  try {
    console.log('Adding guestCategory column to Guest table...');
    
    // Add the column if it doesn't exist
    await sql`ALTER TABLE "Guest" ADD COLUMN IF NOT EXISTS "guestCategory" TEXT`;
    
    console.log('✅ Migration complete! guestCategory column added to Guest table.');
    console.log('✅ VipPass table untouched - all existing data preserved.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
