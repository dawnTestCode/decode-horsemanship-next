// lib/email.ts
// Email sending via Resend, SMS via Twilio

import { Resend } from 'resend';
import twilio from 'twilio';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM_EMAIL = 'Decode Horsemanship <hello@decodehorsemanship.com>';
const GROUNDWORK_FROM_EMAIL = 'Groundwork <groundwork@decodehorsemanship.com>';
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'dawn@decodehorsemanship.com';
const OWNER_PHONE = process.env.OWNER_PHONE;
const GROUNDWORK_EMAIL = 'groundwork@decodehorsemanship.com';

// Twilio client (lazy initialization)
function getTwilio() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) {
    return null;
  }
  return twilio(accountSid, authToken);
}

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

// ─── Groundwork Confirmation Email ───────────────────────────────────────────

export async function sendGroundworkConfirmation({
  registration,
  confirmationCode,
}: {
  registration: {
    first_name: string;
    email: string;
    deposit_amount: number;
    balance_due: number;
  };
  confirmationCode: string;
}) {
  const firstName = registration.first_name;
  const balanceDue = registration.balance_due;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin: 0; padding: 0; background: #f5f1ea; font-family: Georgia, serif;">
  <div style="max-width: 560px; margin: 0 auto; background: #f5f1ea;">

    <!-- Header -->
    <div style="background: #1a1a1a; padding: 40px; text-align: center;">
      <h1 style="margin: 0; color: #f5f1ea; font-size: 32px; font-weight: 500; letter-spacing: -0.5px;">
        Groundwork
      </h1>
      <div style="width: 60px; height: 1px; background: rgba(245,241,234,0.3); margin: 16px auto;"></div>
      <p style="margin: 0; color: rgba(245,241,234,0.7); font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; font-family: Arial, sans-serif;">
        A day with horses
      </p>
    </div>

    <!-- Body -->
    <div style="padding: 48px 40px;">
      <p style="color: #1a1a1a; font-size: 18px; line-height: 1.7; margin: 0 0 32px;">
        ${firstName},<br><br>
        We've got you down. You'll hear from Dawn within 48 hours with logistics.
      </p>

      <!-- Confirmation details -->
      <div style="border: 1px solid #ddd; padding: 24px; margin-bottom: 32px;">
        <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;">
          <tr>
            <td style="padding: 8px 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Confirmation</td>
            <td style="padding: 8px 0; font-size: 18px; font-weight: 600; color: #1a1a1a; font-family: monospace; text-align: right;">
              ${confirmationCode}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; border-top: 1px solid #eee;">Deposit Paid</td>
            <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; text-align: right; border-top: 1px solid #eee;">
              ${formatCurrency(registration.deposit_amount)}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Balance Due</td>
            <td style="padding: 8px 0; font-size: 14px; color: #666; text-align: right;">
              ${formatCurrency(balanceDue)} — 14 days before your session
            </td>
          </tr>
        </table>
      </div>

      <!-- What to bring -->
      <div style="margin-bottom: 32px;">
        <p style="color: #1a1a1a; font-size: 16px; font-weight: 500; margin: 0 0 12px;">What to Bring</p>
        <ul style="color: #666; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0; font-family: Arial, sans-serif;">
          <li>Closed-toe shoes (boots or sturdy sneakers)</li>
          <li>Long pants</li>
          <li>Layers for weather</li>
        </ul>
        <p style="color: #888; font-size: 13px; margin: 16px 0 0; font-family: Arial, sans-serif;">
          8:30 AM to 4:00 PM. Lunch included.
        </p>
      </div>

      <!-- Questions -->
      <div style="border-top: 1px solid #ddd; padding-top: 24px;">
        <p style="color: #666; font-size: 14px; margin: 0; font-family: Arial, sans-serif;">
          Questions? Reply to this email or reach us at
          <a href="mailto:${GROUNDWORK_EMAIL}" style="color: #1a1a1a;">${GROUNDWORK_EMAIL}</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #1a1a1a; padding: 24px 40px; text-align: center;">
      <p style="color: rgba(245,241,234,0.5); font-size: 12px; margin: 0; font-family: Arial, sans-serif;">
        Groundwork · A program of Decode Horsemanship · Chapel Hill, NC
      </p>
    </div>

  </div>
</body>
</html>`;

  await getResend().emails.send({
    from: GROUNDWORK_FROM_EMAIL,
    to: registration.email,
    subject: `We've got you down (${confirmationCode})`,
    html,
  });
}

// ─── Dust & Leather Confirmation Email ────────────────────────────────────────

const DUST_LEATHER_FROM_EMAIL = 'Dust & Leather <dustleather@decodehorsemanship.com>';
const DUST_LEATHER_EMAIL = 'dustleather@decodehorsemanship.com';

export async function sendDustLeatherConfirmation({
  booking,
  confirmationCode,
}: {
  booking: {
    name: string;
    email: string;
    party_size: number;
    package_type: string;
    amount_paid: number;
  };
  confirmationCode: string;
}) {
  const packageName = booking.package_type === 'day-pass'
    ? 'Day Pass'
    : 'Stay for the Fire';

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin: 0; padding: 0; background: #E8DCC4; font-family: Georgia, serif;">
  <div style="max-width: 560px; margin: 0 auto; background: #E8DCC4;">

    <!-- Header -->
    <div style="background: #1F1A16; padding: 40px; text-align: center;">
      <h1 style="margin: 0; color: #DDD2B8; font-size: 32px; font-weight: 400; letter-spacing: 1px; font-family: serif;">
        Dust &amp; Leather
      </h1>
      <div style="width: 60px; height: 1px; background: rgba(168,168,150,0.4); margin: 16px auto;"></div>
      <p style="margin: 0; color: #A8A896; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; font-family: Arial, sans-serif;">
        A day at Decode Horsemanship
      </p>
    </div>

    <!-- Body -->
    <div style="padding: 48px 40px;">
      <p style="color: #2E2A23; font-size: 18px; line-height: 1.7; margin: 0 0 32px;">
        ${booking.name.split(' ')[0]},<br><br>
        We've got your spot. You'll hear from the horseman within 48 hours to lock down the date.
      </p>

      <!-- Confirmation details -->
      <div style="border: 1px solid #C8BB9C; padding: 24px; margin-bottom: 32px;">
        <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;">
          <tr>
            <td style="padding: 8px 0; color: #6B6452; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Confirmation</td>
            <td style="padding: 8px 0; font-size: 18px; font-weight: 600; color: #2E2A23; font-family: monospace; text-align: right;">
              ${confirmationCode}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6B6452; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; border-top: 1px solid #DDD2B8;">Package</td>
            <td style="padding: 8px 0; font-size: 14px; color: #2E2A23; text-align: right; border-top: 1px solid #DDD2B8;">
              ${packageName}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6B6452; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Party Size</td>
            <td style="padding: 8px 0; font-size: 14px; color: #2E2A23; text-align: right;">
              ${booking.party_size} men
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6B6452; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Paid</td>
            <td style="padding: 8px 0; font-size: 14px; color: #5B6655; font-weight: 600; text-align: right;">
              ${formatCurrency(booking.amount_paid)}
            </td>
          </tr>
        </table>
      </div>

      <!-- What to bring -->
      <div style="margin-bottom: 32px;">
        <p style="color: #2E2A23; font-size: 16px; font-weight: 500; margin: 0 0 12px;">What to Bring</p>
        <ul style="color: #6B6452; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0; font-family: Arial, sans-serif;">
          <li>Boots or sturdy work shoes</li>
          <li>Long pants (jeans, work pants)</li>
          <li>A hat with a brim</li>
          <li>Layers — mornings are cool</li>
          <li>A change of clothes for the drive home</li>
        </ul>
      </div>

      <!-- Questions -->
      <div style="border-top: 1px solid #C8BB9C; padding-top: 24px;">
        <p style="color: #6B6452; font-size: 14px; margin: 0; font-family: Arial, sans-serif;">
          Questions? Reply to this email or text the horseman at
          <span style="color: #2E2A23;">(919) 244-2647</span>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #1F1A16; padding: 24px 40px; text-align: center;">
      <p style="color: rgba(168,168,150,0.6); font-size: 12px; margin: 0; font-family: Arial, sans-serif;">
        Dust &amp; Leather · Decode Horsemanship · Chapel Hill, NC
      </p>
    </div>

  </div>
</body>
</html>`;

  await getResend().emails.send({
    from: DUST_LEATHER_FROM_EMAIL,
    to: booking.email,
    subject: `You're in (${confirmationCode})`,
    html,
  });
}

// ─── Dust & Leather Owner Notification ────────────────────────────────────────

export async function sendDustLeatherOwnerNotification({
  booking,
}: {
  booking: {
    confirmation_code: string;
    name: string;
    email: string;
    phone: string | null;
    party_size: number;
    package_type: string;
    message: string | null;
    amount_paid: number;
  };
}) {
  const packageName = booking.package_type === 'day-pass'
    ? 'Day Pass ($725)'
    : 'Stay for the Fire ($895)';

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background: #E8DCC4; padding: 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 4px; overflow: hidden; border: 1px solid #C8BB9C;">

    <div style="background: #1F1A16; padding: 20px 24px;">
      <p style="margin: 0; color: #A8A896; font-size: 11px; letter-spacing: 2px;">DUST &amp; LEATHER</p>
      <h2 style="margin: 4px 0 0; color: #DDD2B8; font-size: 20px; font-weight: 500;">New Booking</h2>
    </div>

    <div style="padding: 24px;">

      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr style="background: #f9f9f9;">
          <td style="padding: 10px 12px; color: #666; width: 35%;">Confirmation</td>
          <td style="padding: 10px 12px; font-family: monospace; font-weight: 700;">
            ${booking.confirmation_code}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; color: #666;">Name</td>
          <td style="padding: 10px 12px; font-weight: 600;">${booking.name}</td>
        </tr>
        <tr style="background: #f9f9f9;">
          <td style="padding: 10px 12px; color: #666;">Email</td>
          <td style="padding: 10px 12px;">
            <a href="mailto:${booking.email}">${booking.email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; color: #666;">Phone</td>
          <td style="padding: 10px 12px;">${booking.phone || 'Not provided'}</td>
        </tr>
        <tr style="background: #f9f9f9;">
          <td style="padding: 10px 12px; color: #666;">Package</td>
          <td style="padding: 10px 12px; font-weight: 600;">${packageName}</td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; color: #666;">Party Size</td>
          <td style="padding: 10px 12px;">${booking.party_size} men</td>
        </tr>
        <tr style="background: #f9f9f9;">
          <td style="padding: 10px 12px; color: #666;">Paid</td>
          <td style="padding: 10px 12px; font-weight: 600; color: #5B6655;">
            ${formatCurrency(booking.amount_paid)}
          </td>
        </tr>
        ${booking.message ? `
        <tr>
          <td style="padding: 10px 12px; color: #666; vertical-align: top; border-top: 2px solid #eee;">Message</td>
          <td style="padding: 10px 12px; font-style: italic; border-top: 2px solid #eee;">${booking.message}</td>
        </tr>` : ''}
      </table>

    </div>

    <div style="background: #f5f5f5; padding: 16px 24px; text-align: center; font-size: 12px; color: #999;">
      Reply to coordinate the date
    </div>

  </div>
</body>
</html>`;

  await getResend().emails.send({
    from: DUST_LEATHER_FROM_EMAIL,
    to: DUST_LEATHER_EMAIL,
    replyTo: booking.email,
    subject: `New Dust & Leather booking — ${booking.name} (${booking.confirmation_code})`,
    html,
  });
}

// ─── Groundwork Owner Notification ───────────────────────────────────────────

export async function sendGroundworkOwnerNotification({
  registration,
  depositAmount,
  balanceDue,
}: {
  registration: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    age_range?: string | null;
    referral_source?: string | null;
    horse_experience?: string | null;
    anything_to_know?: string | null;
    what_brought_you?: string | null;
    confirmation_code: string;
  };
  depositAmount: number;
  balanceDue: number;
}) {
  const fullName = `${registration.first_name} ${registration.last_name}`;

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background: #f5f1ea; padding: 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 4px; overflow: hidden; border: 1px solid #ddd;">

    <div style="background: #1a1a1a; padding: 20px 24px;">
      <p style="margin: 0; color: #888; font-size: 11px; letter-spacing: 2px;">GROUNDWORK</p>
      <h2 style="margin: 4px 0 0; color: #f5f1ea; font-size: 20px; font-weight: 500;">New Registration</h2>
    </div>

    <div style="padding: 24px;">

      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr style="background: #f9f9f9;">
          <td style="padding: 10px 12px; color: #666; width: 35%;">Confirmation</td>
          <td style="padding: 10px 12px; font-family: monospace; font-weight: 700;">
            ${registration.confirmation_code}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; color: #666;">Name</td>
          <td style="padding: 10px 12px; font-weight: 600;">${fullName}</td>
        </tr>
        <tr style="background: #f9f9f9;">
          <td style="padding: 10px 12px; color: #666;">Email</td>
          <td style="padding: 10px 12px;">
            <a href="mailto:${registration.email}">${registration.email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; color: #666;">Phone</td>
          <td style="padding: 10px 12px;">${registration.phone}</td>
        </tr>
        ${registration.age_range ? `
        <tr style="background: #f9f9f9;">
          <td style="padding: 10px 12px; color: #666;">Age Range</td>
          <td style="padding: 10px 12px;">${registration.age_range}</td>
        </tr>` : ''}
        <tr>
          <td style="padding: 10px 12px; color: #666;">Horse Experience</td>
          <td style="padding: 10px 12px;">${registration.horse_experience || 'Not specified'}</td>
        </tr>
        ${registration.referral_source ? `
        <tr style="background: #f9f9f9;">
          <td style="padding: 10px 12px; color: #666;">How They Found Us</td>
          <td style="padding: 10px 12px;">${registration.referral_source}</td>
        </tr>` : ''}
        <tr>
          <td style="padding: 10px 12px; color: #666; border-top: 2px solid #eee;">Deposit Paid</td>
          <td style="padding: 10px 12px; border-top: 2px solid #eee; font-weight: 600; color: #2a7a2a;">
            ${formatCurrency(depositAmount)}
          </td>
        </tr>
        <tr style="background: #f9f9f9;">
          <td style="padding: 10px 12px; color: #666;">Balance Due</td>
          <td style="padding: 10px 12px; color: #c05000;">
            ${formatCurrency(balanceDue)}
          </td>
        </tr>
        ${registration.anything_to_know ? `
        <tr>
          <td style="padding: 10px 12px; color: #666; vertical-align: top; border-top: 2px solid #eee;">Anything to Know</td>
          <td style="padding: 10px 12px; font-style: italic; border-top: 2px solid #eee;">${registration.anything_to_know}</td>
        </tr>` : ''}
        ${registration.what_brought_you ? `
        <tr style="background: #f9f9f9;">
          <td style="padding: 10px 12px; color: #666; vertical-align: top;">What Brought Them</td>
          <td style="padding: 10px 12px; font-style: italic;">${registration.what_brought_you}</td>
        </tr>` : ''}
      </table>

    </div>

    <div style="background: #f5f5f5; padding: 16px 24px; text-align: center; font-size: 12px; color: #999;">
      View all registrations in your
      <a href="https://supabase.com/dashboard" style="color: #666;">Supabase dashboard</a>
    </div>

  </div>
</body>
</html>`;

  await getResend().emails.send({
    from: GROUNDWORK_FROM_EMAIL,
    to: GROUNDWORK_EMAIL,
    subject: `New Groundwork registration — ${fullName} (${registration.confirmation_code})`,
    html,
  });
}

// ─── Contact Inquiry Notification ─────────────────────────────────────────────

export async function sendContactInquiryNotification({
  inquiry,
}: {
  inquiry: {
    name: string;
    email: string;
    phone?: string | null;
    inquiry_type: string;
    horse_name?: string | null;
    message: string;
  };
}) {
  const inquiryTypeLabels: Record<string, string> = {
    adoption: 'Horse Adoption',
    boarding: 'Boarding Inquiry',
    general: 'General Question',
    'volunteer/support': 'Volunteer/Support',
    corporate: 'Corporate Programs',
    personal: 'Personal Development',
    mustang: 'Mustang Immersion',
    youth: 'Youth Programs',
  };

  const typeLabel = inquiryTypeLabels[inquiry.inquiry_type] || inquiry.inquiry_type;

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background: #f5f1ea; padding: 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 4px; overflow: hidden; border: 1px solid #ddd;">

    <div style="background: #1a1a1a; padding: 20px 24px;">
      <p style="margin: 0; color: #888; font-size: 11px; letter-spacing: 2px;">DECODE HORSEMANSHIP</p>
      <h2 style="margin: 4px 0 0; color: #f5f1ea; font-size: 20px; font-weight: 500;">New ${typeLabel} Inquiry</h2>
    </div>

    <div style="padding: 24px;">

      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr style="background: #f9f9f9;">
          <td style="padding: 10px 12px; color: #666; width: 30%;">Name</td>
          <td style="padding: 10px 12px; font-weight: 600;">${inquiry.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; color: #666;">Email</td>
          <td style="padding: 10px 12px;">
            <a href="mailto:${inquiry.email}" style="color: #1a1a1a;">${inquiry.email}</a>
          </td>
        </tr>
        ${inquiry.phone ? `
        <tr style="background: #f9f9f9;">
          <td style="padding: 10px 12px; color: #666;">Phone</td>
          <td style="padding: 10px 12px;">${inquiry.phone}</td>
        </tr>` : ''}
        <tr${inquiry.phone ? '' : ' style="background: #f9f9f9;"'}>
          <td style="padding: 10px 12px; color: #666;">Type</td>
          <td style="padding: 10px 12px;">${typeLabel}</td>
        </tr>
        ${inquiry.horse_name ? `
        <tr style="background: #f9f9f9;">
          <td style="padding: 10px 12px; color: #666;">Horse</td>
          <td style="padding: 10px 12px;">${inquiry.horse_name}</td>
        </tr>` : ''}
        <tr>
          <td style="padding: 10px 12px; color: #666; vertical-align: top; border-top: 2px solid #eee;">Message</td>
          <td style="padding: 10px 12px; border-top: 2px solid #eee; line-height: 1.5;">${inquiry.message.replace(/\n/g, '<br>')}</td>
        </tr>
      </table>

    </div>

    <div style="background: #f5f5f5; padding: 16px 24px; text-align: center; font-size: 12px; color: #999;">
      Reply directly to this email to respond
    </div>

  </div>
</body>
</html>`;

  // Send email
  await getResend().emails.send({
    from: FROM_EMAIL,
    to: OWNER_EMAIL,
    replyTo: inquiry.email,
    subject: `New inquiry from ${inquiry.name} — ${typeLabel}`,
    html,
  });

  // Send SMS if configured
  await sendSmsNotification(
    `New ${typeLabel} inquiry from ${inquiry.name}. Check your email for details.`
  );
}

// ─── SMS Notification ─────────────────────────────────────────────────────────

export async function sendSmsNotification(message: string) {
  const client = getTwilio();
  if (!client || !OWNER_PHONE || !process.env.TWILIO_PHONE_NUMBER) {
    // SMS not configured, skip silently
    return;
  }

  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: OWNER_PHONE,
    });
  } catch (error) {
    // Log but don't throw - SMS is secondary to email
    console.error('Failed to send SMS notification:', error);
  }
}

// ─── Summer Camp Confirmation Email ───────────────────────────────────────────

const SUMMER_CAMP_FROM_EMAIL = 'Decode Summer Camp <summercamp@decodehorsemanship.com>';

export async function sendSummerCampConfirmation({
  registration,
  confirmationCode,
}: {
  registration: {
    camper_first_name: string;
    camper_last_name: string;
    parent_name: string;
    parent_email: string;
    tier: string;
    session_1: string;
    session_2: string | null;
    deposit_paid: number;
    balance_due: number;
  };
  confirmationCode: string;
}) {
  const tierLabel = registration.tier === 'explorers' ? 'Explorers (Ages 6–9)' : 'Trailblazers (Ages 10–14)';
  const parentFirst = registration.parent_name.split(' ')[0];

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin: 0; padding: 0; background: #1c1917; font-family: Arial, sans-serif;">
  <div style="max-width: 560px; margin: 0 auto; background: #1c1917;">

    <!-- Header -->
    <div style="background: #b91c1c; padding: 40px; text-align: center;">
      <p style="margin: 0 0 8px; color: rgba(255,255,255,0.7); font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">
        Decode Horsemanship
      </p>
      <h1 style="margin: 0; color: #fff; font-size: 28px; font-weight: 700;">
        Summer Camp
      </h1>
    </div>

    <!-- Body -->
    <div style="padding: 40px; background: #292524;">
      <p style="color: #fafaf9; font-size: 18px; line-height: 1.6; margin: 0 0 24px;">
        ${parentFirst},<br><br>
        You're all set! <strong>${registration.camper_first_name}</strong> is registered for summer camp.
      </p>

      <!-- Confirmation details -->
      <div style="background: #1c1917; border: 1px solid #44403c; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #a8a29e; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Confirmation</td>
            <td style="padding: 8px 0; font-size: 18px; font-weight: 700; color: #fafaf9; font-family: monospace; text-align: right;">
              ${confirmationCode}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #a8a29e; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; border-top: 1px solid #44403c;">Camper</td>
            <td style="padding: 8px 0; font-size: 14px; color: #fafaf9; text-align: right; border-top: 1px solid #44403c;">
              ${registration.camper_first_name} ${registration.camper_last_name}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #a8a29e; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Program</td>
            <td style="padding: 8px 0; font-size: 14px; color: #fafaf9; text-align: right;">
              ${tierLabel}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #a8a29e; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; border-top: 1px solid #44403c;">Deposit Paid</td>
            <td style="padding: 8px 0; font-size: 14px; color: #4ade80; text-align: right; border-top: 1px solid #44403c;">
              ${formatCurrency(registration.deposit_paid)}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #a8a29e; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Balance Due</td>
            <td style="padding: 8px 0; font-size: 14px; color: #fbbf24; text-align: right;">
              ${formatCurrency(registration.balance_due)} — 2 weeks before session
            </td>
          </tr>
        </table>
      </div>

      <!-- What's next -->
      <div style="margin-bottom: 24px;">
        <p style="color: #fafaf9; font-size: 14px; font-weight: 600; margin: 0 0 12px;">What's Next</p>
        <ul style="color: #d6d3d1; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0;">
          <li>Complete the <a href="https://forms.gle/DszFyex1HKBbLDw6A" style="color: #f87171;">liability waiver</a> before the first day</li>
          <li>You'll receive a balance invoice 2 weeks before camp</li>
          <li>Packing list and directions will be sent closer to your session</li>
        </ul>
      </div>

      <!-- Questions -->
      <div style="border-top: 1px solid #44403c; padding-top: 20px;">
        <p style="color: #a8a29e; font-size: 14px; margin: 0;">
          Questions? Reply to this email or reach us at
          <a href="mailto:dawn@decodehorsemanship.com" style="color: #f87171;">dawn@decodehorsemanship.com</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #1c1917; padding: 20px; text-align: center; border-top: 1px solid #44403c;">
      <p style="color: #78716c; font-size: 12px; margin: 0;">
        Decode Horsemanship · Summer Camp · Chapel Hill, NC
      </p>
    </div>

  </div>
</body>
</html>`;

  await getResend().emails.send({
    from: SUMMER_CAMP_FROM_EMAIL,
    to: registration.parent_email,
    subject: `${registration.camper_first_name} is registered! (${confirmationCode})`,
    html,
  });
}

// ─── Summer Camp Owner Notification ───────────────────────────────────────────

export async function sendSummerCampOwnerNotification({
  registration,
}: {
  registration: {
    confirmation_code: string;
    camper_first_name: string;
    camper_last_name: string;
    camper_dob: string;
    tier: string;
    session_1: string;
    session_2: string | null;
    tshirt_size: string;
    horse_experience: string | null;
    referral_source: string | null;
    is_sibling: boolean;
    sibling_confirmation_code: string | null;
    parent_name: string;
    parent_email: string;
    parent_phone: string;
    emergency_name: string;
    emergency_relationship: string;
    emergency_phone: string;
    allergies: string | null;
    medical_conditions: string | null;
    needs_accommodations: boolean;
    accommodations_details: string | null;
    photo_release: boolean;
    deposit_paid: number;
    balance_due: number;
    discount_type: string | null;
  };
}) {
  const tierLabel = registration.tier === 'explorers' ? 'Explorers (6–9)' : 'Trailblazers (10–14)';
  const camperName = `${registration.camper_first_name} ${registration.camper_last_name}`;

  const discountLabels: Record<string, string> = {
    early_bird: 'Early Bird',
    sibling: 'Sibling',
    early_bird_sibling: 'Early Bird + Sibling',
  };

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background: #1c1917; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #292524; border-radius: 8px; overflow: hidden; border: 1px solid #44403c;">

    <div style="background: #b91c1c; padding: 20px 24px;">
      <p style="margin: 0; color: rgba(255,255,255,0.7); font-size: 11px; letter-spacing: 2px;">SUMMER CAMP</p>
      <h2 style="margin: 4px 0 0; color: #fff; font-size: 20px; font-weight: 600;">New Registration</h2>
    </div>

    <div style="padding: 24px;">

      <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #fafaf9;">
        <tr style="background: #1c1917;">
          <td style="padding: 10px 12px; color: #a8a29e; width: 35%;">Confirmation</td>
          <td style="padding: 10px 12px; font-family: monospace; font-weight: 700;">
            ${registration.confirmation_code}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; color: #a8a29e;">Camper</td>
          <td style="padding: 10px 12px; font-weight: 600;">${camperName}</td>
        </tr>
        <tr style="background: #1c1917;">
          <td style="padding: 10px 12px; color: #a8a29e;">DOB</td>
          <td style="padding: 10px 12px;">${registration.camper_dob}</td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; color: #a8a29e;">Program</td>
          <td style="padding: 10px 12px;">${tierLabel}</td>
        </tr>
        <tr style="background: #1c1917;">
          <td style="padding: 10px 12px; color: #a8a29e;">Session(s)</td>
          <td style="padding: 10px 12px;">
            ${registration.session_1}${registration.session_2 ? `, ${registration.session_2}` : ''}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; color: #a8a29e;">T-Shirt Size</td>
          <td style="padding: 10px 12px;">${registration.tshirt_size}</td>
        </tr>
        <tr style="background: #1c1917;">
          <td style="padding: 10px 12px; color: #a8a29e;">Horse Experience</td>
          <td style="padding: 10px 12px;">${registration.horse_experience || 'Not specified'}</td>
        </tr>
        ${registration.referral_source ? `
        <tr>
          <td style="padding: 10px 12px; color: #a8a29e;">How They Found Us</td>
          <td style="padding: 10px 12px;">${registration.referral_source}</td>
        </tr>` : ''}
        ${registration.is_sibling ? `
        <tr style="background: #1c1917;">
          <td style="padding: 10px 12px; color: #a8a29e;">Sibling Code</td>
          <td style="padding: 10px 12px;">${registration.sibling_confirmation_code || 'Not provided'}</td>
        </tr>` : ''}

        <tr><td colspan="2" style="padding: 8px 0;"><div style="border-top: 2px solid #44403c;"></div></td></tr>

        <tr style="background: #1c1917;">
          <td style="padding: 10px 12px; color: #a8a29e;">Parent/Guardian</td>
          <td style="padding: 10px 12px; font-weight: 600;">${registration.parent_name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 12px; color: #a8a29e;">Email</td>
          <td style="padding: 10px 12px;">
            <a href="mailto:${registration.parent_email}" style="color: #f87171;">${registration.parent_email}</a>
          </td>
        </tr>
        <tr style="background: #1c1917;">
          <td style="padding: 10px 12px; color: #a8a29e;">Phone</td>
          <td style="padding: 10px 12px;">${registration.parent_phone}</td>
        </tr>

        <tr><td colspan="2" style="padding: 8px 0;"><div style="border-top: 2px solid #44403c;"></div></td></tr>

        <tr>
          <td style="padding: 10px 12px; color: #a8a29e;">Emergency Contact</td>
          <td style="padding: 10px 12px;">${registration.emergency_name} (${registration.emergency_relationship})</td>
        </tr>
        <tr style="background: #1c1917;">
          <td style="padding: 10px 12px; color: #a8a29e;">Emergency Phone</td>
          <td style="padding: 10px 12px;">${registration.emergency_phone}</td>
        </tr>

        <tr><td colspan="2" style="padding: 8px 0;"><div style="border-top: 2px solid #44403c;"></div></td></tr>

        <tr>
          <td style="padding: 10px 12px; color: #a8a29e;">Allergies</td>
          <td style="padding: 10px 12px;">${registration.allergies || 'None'}</td>
        </tr>
        ${registration.medical_conditions ? `
        <tr style="background: #1c1917;">
          <td style="padding: 10px 12px; color: #a8a29e;">Medical</td>
          <td style="padding: 10px 12px;">${registration.medical_conditions}</td>
        </tr>` : ''}
        ${registration.needs_accommodations ? `
        <tr>
          <td style="padding: 10px 12px; color: #a8a29e;">Accommodations</td>
          <td style="padding: 10px 12px;">${registration.accommodations_details || 'Needs accommodations'}</td>
        </tr>` : ''}
        <tr style="background: #1c1917;">
          <td style="padding: 10px 12px; color: #a8a29e;">Photo Release</td>
          <td style="padding: 10px 12px;">${registration.photo_release ? 'Yes' : 'No'}</td>
        </tr>

        <tr><td colspan="2" style="padding: 8px 0;"><div style="border-top: 2px solid #44403c;"></div></td></tr>

        <tr>
          <td style="padding: 10px 12px; color: #a8a29e;">Deposit Paid</td>
          <td style="padding: 10px 12px; font-weight: 600; color: #4ade80;">
            ${formatCurrency(registration.deposit_paid)}
          </td>
        </tr>
        <tr style="background: #1c1917;">
          <td style="padding: 10px 12px; color: #a8a29e;">Balance Due</td>
          <td style="padding: 10px 12px; color: #fbbf24;">
            ${formatCurrency(registration.balance_due)}
          </td>
        </tr>
        ${registration.discount_type ? `
        <tr>
          <td style="padding: 10px 12px; color: #a8a29e;">Discount</td>
          <td style="padding: 10px 12px; color: #4ade80;">${discountLabels[registration.discount_type] || registration.discount_type}</td>
        </tr>` : ''}
      </table>

    </div>

    <div style="background: #1c1917; padding: 16px 24px; text-align: center; font-size: 12px; color: #78716c;">
      View all registrations in your Supabase dashboard
    </div>

  </div>
</body>
</html>`;

  await getResend().emails.send({
    from: SUMMER_CAMP_FROM_EMAIL,
    to: OWNER_EMAIL,
    replyTo: registration.parent_email,
    subject: `New Summer Camp registration — ${camperName} (${registration.confirmation_code})`,
    html,
  });
}
