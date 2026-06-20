-- Add reminder_sent_at column to womens_retreat_registrations for tracking reminder emails
ALTER TABLE womens_retreat_registrations
ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMPTZ;

-- Add index for efficient lookup of registrations needing reminders
CREATE INDEX IF NOT EXISTS idx_womens_retreat_registrations_reminder
ON womens_retreat_registrations (session_date, reminder_sent_at)
WHERE reminder_sent_at IS NULL;
