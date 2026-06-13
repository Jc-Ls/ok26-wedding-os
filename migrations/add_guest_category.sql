-- Add guestCategory column to Guest table if it doesn't exist
ALTER TABLE "Guest" 
ADD COLUMN IF NOT EXISTS "guestCategory" TEXT;

-- Add index for better query performance on guestCategory
CREATE INDEX IF NOT EXISTS "idx_guest_category" ON "Guest"("guestCategory");
