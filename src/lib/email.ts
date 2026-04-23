// lib/email.ts
// Email sending via Resend

import { Resend } from 'resend';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM_EMAIL = 'Decode Horsemanship <hello@decodehorsemanship.com>';
const GROUNDWORK_FROM_EMAIL = 'Groundwork <groundwork@decodehorsemanship.com>';
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'dawn@decodehorsemanship.com';
const GROUNDWORK_EMAIL = 'groundwork@decodehorsemanship.com';

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
