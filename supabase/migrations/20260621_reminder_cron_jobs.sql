-- Enable pg_cron and pg_net extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule reminder functions to run daily at 9am ET (13:00 UTC)
-- These call edge functions which handle the actual email sending
--
-- SETUP REQUIRED: Add these secrets to Supabase Vault (Database → Vault → Secrets):
--   1. supabase_url: Your project URL (e.g., https://xxxxx.supabase.co)
--   2. service_role_key: Your service role key (from Project Settings → API)

-- No Reins reminder (sends 2-4 days before Saturday workshops)
SELECT cron.unschedule('no-reins-reminder') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'no-reins-reminder'
);
SELECT cron.schedule(
  'no-reins-reminder',
  '0 13 * * *',  -- Daily at 13:00 UTC (9am ET)
  $$
  SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'supabase_url') || '/functions/v1/no-reins-reminder',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'service_role_key')
    ),
    body := '{}'::jsonb
  );
  $$
);

-- Dust & Leather reminder (sends 2-4 days before Saturday sessions)
SELECT cron.unschedule('dust-leather-reminder') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'dust-leather-reminder'
);
SELECT cron.schedule(
  'dust-leather-reminder',
  '0 13 * * *',  -- Daily at 13:00 UTC (9am ET)
  $$
  SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'supabase_url') || '/functions/v1/dust-leather-reminder',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'service_role_key')
    ),
    body := '{}'::jsonb
  );
  $$
);

-- Groundwork reminder (sends 6-8 days before sessions)
SELECT cron.unschedule('groundwork-reminder') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'groundwork-reminder'
);
SELECT cron.schedule(
  'groundwork-reminder',
  '0 13 * * *',  -- Daily at 13:00 UTC (9am ET)
  $$
  SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'supabase_url') || '/functions/v1/groundwork-reminder',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'service_role_key')
    ),
    body := '{}'::jsonb
  );
  $$
);
