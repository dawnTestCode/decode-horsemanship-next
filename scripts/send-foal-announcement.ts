/**
 * Foal Lessons Announcement Script
 *
 * Run this script when the foal is ready for visitors to send
 * a batch announcement email to everyone on the waitlist.
 *
 * Usage:
 *   npx tsx scripts/send-foal-announcement.ts
 *
 * Required environment variables:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 *   - RESEND_API_KEY
 *
 * Before running:
 *   1. Update the email content below with real dates and booking info
 *   2. Test with a single email first (set DRY_RUN = false, SINGLE_TEST_EMAIL = 'your@email.com')
 *   3. When ready for real send, set SINGLE_TEST_EMAIL = null
 */

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// ─── Configuration ─────────────────────────────────────────────────────────────

const DRY_RUN = true; // Set to false to actually send emails
const SINGLE_TEST_EMAIL: string | null = null; // Set to an email to test with one recipient

// Update these before sending!
const FOAL_NAME = 'TBD'; // The foal's name
const LESSON_DATES = 'August 10, 17, 24, 31'; // Available lesson dates
const BOOKING_URL = 'https://decodehorsemanship.com/foal-lessons/book'; // Booking URL (update when ready)

// ─── Setup ─────────────────────────────────────────────────────────────────────

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'Decode Horsemanship <hello@decodehorsemanship.com>';

// ─── Email Template ────────────────────────────────────────────────────────────

function generateAnnouncementEmail(name: string): string {
  const firstName = name.split(' ')[0];

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin: 0; padding: 0; background: #1a1a1a; font-family: Arial, sans-serif;">
  <div style="max-width: 560px; margin: 0 auto; background: #1a1a1a;">

    <!-- Header -->
    <div style="background: #9E1B32; padding: 40px; text-align: center;">
      <p style="margin: 0 0 8px; color: rgba(255,255,255,0.7); font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">
        Decode Horsemanship
      </p>
      <h1 style="margin: 0; color: #fff; font-size: 28px; font-weight: 700;">
        The Foal Is Ready!
      </h1>
    </div>

    <!-- Body -->
    <div style="padding: 40px; background: #262626;">
      <p style="color: #fafafa; font-size: 18px; line-height: 1.6; margin: 0 0 24px;">
        ${firstName},
      </p>
      <p style="color: #d4d4d4; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
        The wait is over! Our Gypsy Vanner foal, <strong>${FOAL_NAME}</strong>, is ready to meet you.
      </p>
      <p style="color: #d4d4d4; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
        Foal handling lessons are now available. These small-group sessions will teach you
        the foundations of working with young horses — how to approach, communicate, and
        build trust from the very beginning.
      </p>

      <!-- Dates -->
      <div style="background: #1a1a1a; border: 1px solid #404040; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <p style="color: #fafafa; font-size: 14px; font-weight: 600; margin: 0 0 12px;">Available Dates</p>
        <p style="color: #a3a3a3; font-size: 14px; line-height: 1.6; margin: 0;">
          ${LESSON_DATES}
        </p>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin-bottom: 24px;">
        <a href="${BOOKING_URL}"
           style="display: inline-block; padding: 16px 32px; background: #9E1B32; color: #fff; text-decoration: none; font-weight: 600; border-radius: 8px;">
          Book Your Session
        </a>
      </div>

      <p style="color: #a3a3a3; font-size: 14px; line-height: 1.6; margin: 0; text-align: center;">
        Spots are limited. First come, first served.
      </p>

      <!-- Questions -->
      <div style="border-top: 1px solid #404040; padding-top: 20px; margin-top: 24px;">
        <p style="color: #a3a3a3; font-size: 14px; margin: 0;">
          Questions? Reply to this email or reach us at
          <a href="mailto:dawn@decodehorsemanship.com" style="color: #9E1B32;">dawn@decodehorsemanship.com</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #1a1a1a; padding: 20px; text-align: center; border-top: 1px solid #404040;">
      <p style="color: #737373; font-size: 12px; margin: 0 0 8px;">
        Decode Horsemanship · Chapel Hill, NC
      </p>
      <p style="color: #525252; font-size: 11px; margin: 0;">
        <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color: #525252;">Unsubscribe</a>
      </p>
    </div>

  </div>
</body>
</html>`;
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Foal Lessons Announcement Script');
  console.log('=================================\n');

  if (DRY_RUN) {
    console.log('⚠️  DRY RUN MODE - No emails will be sent\n');
  }

  // Fetch waitlist
  const { data: subscribers, error } = await supabase
    .from('foal_waitlist')
    .select('id, name, email')
    .eq('unsubscribed', false);

  if (error) {
    console.error('Failed to fetch waitlist:', error);
    process.exit(1);
  }

  if (!subscribers || subscribers.length === 0) {
    console.log('No subscribers on the waitlist.');
    process.exit(0);
  }

  console.log(`Found ${subscribers.length} active subscribers\n`);

  // Filter to single test email if set
  let recipients = subscribers;
  if (SINGLE_TEST_EMAIL) {
    recipients = subscribers.filter((s) => s.email === SINGLE_TEST_EMAIL);
    if (recipients.length === 0) {
      console.log(`Test email ${SINGLE_TEST_EMAIL} not found in waitlist`);
      process.exit(1);
    }
    console.log(`Testing with single recipient: ${SINGLE_TEST_EMAIL}\n`);
  }

  // Send emails
  let sent = 0;
  let failed = 0;

  for (const subscriber of recipients) {
    const html = generateAnnouncementEmail(subscriber.name);

    if (DRY_RUN) {
      console.log(`[DRY RUN] Would send to: ${subscriber.email}`);
      sent++;
      continue;
    }

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: subscriber.email,
        subject: `The foal is ready! Book your lesson`,
        html,
        headers: {
          'List-Unsubscribe': '{{{RESEND_UNSUBSCRIBE_URL}}}',
        },
      });
      console.log(`✓ Sent to: ${subscriber.email}`);
      sent++;

      // Rate limit: wait 100ms between emails
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (err) {
      console.error(`✗ Failed to send to ${subscriber.email}:`, err);
      failed++;
    }
  }

  console.log('\n=================================');
  console.log(`Done! Sent: ${sent}, Failed: ${failed}`);

  if (DRY_RUN) {
    console.log('\nTo send for real, set DRY_RUN = false in the script.');
  }
}

main().catch(console.error);
