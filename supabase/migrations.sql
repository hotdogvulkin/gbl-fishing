-- =============================================================================
-- GBL Fishing — Auth migration
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- =============================================================================

-- 1. Add user_id column to trips (safe to run on an existing table)
ALTER TABLE trips
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users;

-- 2. If you have existing rows without a user_id and want to clean them up,
--    either delete them or assign a known user ID:
--    DELETE FROM trips WHERE user_id IS NULL;
--    UPDATE trips SET user_id = '<your-user-uuid>' WHERE user_id IS NULL;

-- 3. Once existing rows are handled, enforce NOT NULL going forward:
--    ALTER TABLE trips ALTER COLUMN user_id SET NOT NULL;
--    (Skip this line if you still have unowned rows you want to keep.)

-- =============================================================================
-- Row-Level Security
-- =============================================================================

-- Enable RLS on both tables (idempotent)
ALTER TABLE trips   ENABLE ROW LEVEL SECURITY;
ALTER TABLE catches ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "own sessions"  ON trips;
DROP POLICY IF EXISTS "own trips"     ON trips;
DROP POLICY IF EXISTS "own catches"   ON catches;

-- trips: each user can only read/write their own rows
CREATE POLICY "own trips" ON trips
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- catches: inherit security through the trip_id → trips.user_id relationship
CREATE POLICY "own catches" ON catches
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = catches.trip_id
        AND trips.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = catches.trip_id
        AND trips.user_id = auth.uid()
    )
  );

-- =============================================================================
-- Google OAuth
-- Nothing to run here — enable it in:
-- Dashboard → Authentication → Providers → Google → toggle Enable
-- You'll need to paste your Google OAuth Client ID and Secret there.
-- Redirect URL to add in Google Cloud Console:
--   https://<your-project-ref>.supabase.co/auth/v1/callback
-- =============================================================================
