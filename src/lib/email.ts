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
