-- Add reminder_sent_at column to dust_and_leather_bookings for tracking sent reminders
ALTER TABLE dust_and_leather_bookings
ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMPTZ;

-- Index for efficient querying of bookings that need reminders
CREATE INDEX IF NOT EXISTS idx_dust_leather_bookings_reminder
ON dust_and_leather_bookings(booked_date, status, reminder_sent_at);
