// supabase/functions/groundwork-reminder/index.ts
// Scheduled function to send reminder emails for Groundwork sessions
// Sends reminders 7 days before the session

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FROM_EMAIL = 'Groundwork <groundwork@decodehorsemanship.com>';

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

async function sendReminderEmail({
  registration,
  resendApiKey,
}: {
  registration: any;
  resendApiKey: string;
}) {
  const balanceDue = registration.balance_due;
  const isPaidInFull = registration.status === 'paid_in_full';

  const balanceSection = isPaidInFull
    ? `
      <div style="background: #f0fdf4; border-left: 3px solid #22c55e; padding: 16px 20px; margin: 24px 0; border-radius: 4px;">
        <p style="margin: 0; color: #166534; font-weight: 600;">
          Your balance is paid in full. You're all set!
        </p>
      </div>
    `
    : `
      <div style="background: #fefce8; border-left: 3px solid #ca8a04; padding: 16px 20px; margin: 24px 0; border-radius: 4px;">
        <p style="margin: 0 0 8px; color: #854d0e; font-weight: 600;">Balance Due: ${formatCurrency(balanceDue)}</p>
        <p style="margin: 0 0 12px; color: #713f12; font-size: 14px;">
          Please pay your remaining balance before your session.
        </p>
        <p style="margin: 0;">
          <a href="https://www.decodehorsemanship.com/groundwork/pay-balance?code=${registration.confirmation_code}"
             style="display: inline-block; background: #ca8a04; color: #fff; font-weight: 600; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 14px;">
            Pay ${formatCurrency(balanceDue)} Now
          </a>
        </p>
      </div>
    `;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin: 0; padding: 0; background: #faf9f7; font-family: Georgia, serif;">
  <div style="max-width: 600px; margin: 0 auto; background: #faf9f7;">

    <!-- Header -->
    <div style="background: #1c1917; padding: 32px 40px;">
      <h1 style="margin: 0; color: #faf9f7; font-size: 28px; font-weight: 500; font-family: Georgia, serif;">
        Groundwork
      </h1>
      <p style="margin: 8px 0 0; color: #a8a29e; font-size: 14px; font-family: Arial, sans-serif;">
        Your session is coming up
      </p>
    </div>

    <!-- Body -->
    <div style="padding: 40px;">
      <p style="color: #44403c; font-size: 16px; line-height: 1.7; margin: 0 0 24px;">
        Hi ${registration.first_name},
      </p>

      <p style="color: #44403c; font-size: 16px; line-height: 1.7; margin: 0 0 24px;">
        This is a reminder that your Groundwork session is one week away.
      </p>

      <!-- Session details -->
      <div style="background: #fff; border: 1px solid #e7e5e4; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;">
          <tr>
            <td style="padding: 8px 0; color: #78716c; font-size: 14px; width: 40%;">Confirmation</td>
            <td style="padding: 8px 0; font-size: 16px; font-weight: 700; color: #1c1917; font-family: monospace;">
              ${registration.confirmation_code}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #78716c; font-size: 14px;">Date</td>
            <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #1c1917;">
              ${formatDate(registration.session_date)}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #78716c; font-size: 14px;">Time</td>
            <td style="padding: 8px 0; font-size: 14px; color: #1c1917;">
              8:30 AM – 4:00 PM
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #78716c; font-size: 14px;">Location</td>
            <td style="padding: 8px 0; font-size: 14px; color: #1c1917;">
              Decode Horsemanship<br>
              Chapel Hill, NC
            </td>
          </tr>
        </table>
      </div>

      ${balanceSection}

      <!-- What to bring -->
      <div style="margin: 32px 0;">
        <p style="color: #1c1917; font-weight: 600; margin: 0 0 12px; font-family: Arial, sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
          What to Bring
        </p>
        <ul style="color: #57534e; font-size: 15px; line-height: 1.8; padding-left: 20px; margin: 0; font-family: Arial, sans-serif;">
          <li>Closed-toe shoes (boots or sturdy sneakers) — required</li>
          <li>Long pants</li>
          <li>Weather-appropriate layers</li>
          <li>Water bottle</li>
        </ul>
        <p style="color: #78716c; font-size: 14px; margin-top: 16px; font-family: Arial, sans-serif;">
          Lunch is provided. Please arrive by 8:15 AM.
        </p>
      </div>

      <!-- Directions -->
      <div style="background: #fff; border: 1px solid #e7e5e4; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <p style="margin: 0 0 8px; color: #1c1917; font-weight: 600; font-family: Arial, sans-serif; font-size: 14px;">
          Getting Here
        </p>
        <p style="margin: 0; color: #57534e; font-size: 14px; font-family: Arial, sans-serif; line-height: 1.6;">
          Detailed directions will be sent separately. If you have any questions about finding us, just reply to this email.
        </p>
      </div>

      <!-- Questions -->
      <div style="border-top: 1px solid #e7e5e4; padding-top: 24px; margin-top: 32px;">
        <p style="color: #78716c; font-size: 14px; margin: 0; font-family: Arial, sans-serif;">
          Questions? Reply to this email or reach us at
          <a href="mailto:groundwork@decodehorsemanship.com" style="color: #1c1917;">groundwork@decodehorsemanship.com</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #1c1917; padding: 24px 40px; text-align: center;">
      <p style="color: #78716c; font-size: 12px; margin: 0; font-family: Arial, sans-serif;">
        Groundwork · A program of Decode Horsemanship · Chapel Hill, NC
      </p>
    </div>

  </div>
</body>
</html>`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: registration.email,
      subject: `Your Groundwork session is one week away — ${formatDate(registration.session_date)}`,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to send reminder email:', error);
    throw new Error(`Email send failed: ${error}`);
  }

  return true;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const resendApiKey = Deno.env.get('RESEND_API_KEY')!;

    // Calculate 7 days from now
    const today = new Date();
    const sevenDaysOut = new Date(today);
    sevenDaysOut.setDate(sevenDaysOut.getDate() + 7);
    const targetDate = sevenDaysOut.toISOString().split('T')[0];

    // Also check 6 and 8 days out to give a small window
    const sixDaysOut = new Date(today);
    sixDaysOut.setDate(sixDaysOut.getDate() + 6);
    const eightDaysOut = new Date(today);
    eightDaysOut.setDate(eightDaysOut.getDate() + 8);

    // Find registrations with sessions 6-8 days away that haven't received a reminder
    const { data: registrations, error: fetchError } = await supabase
      .from('groundwork_registrations')
      .select('*')
      .gte('session_date', sixDaysOut.toISOString().split('T')[0])
      .lte('session_date', eightDaysOut.toISOString().split('T')[0])
      .in('status', ['deposit_paid', 'paid_in_full'])
      .is('reminder_sent_at', null);

    if (fetchError) {
      throw fetchError;
    }

    if (!registrations || registrations.length === 0) {
      return new Response(
        JSON.stringify({
          message: 'No registrations need reminders today',
          targetDate,
          sent: 0,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send reminders
    const results = [];
    for (const registration of registrations) {
      // Skip TBA sessions
      if (registration.session_date === 'TBA') {
        continue;
      }

      try {
        await sendReminderEmail({ registration, resendApiKey });

        // Mark reminder as sent
        await supabase
          .from('groundwork_registrations')
          .update({ reminder_sent_at: new Date().toISOString() })
          .eq('id', registration.id);

        results.push({
          confirmation_code: registration.confirmation_code,
          name: `${registration.first_name} ${registration.last_name}`,
          session_date: registration.session_date,
          status: 'sent',
        });
      } catch (err: any) {
        results.push({
          confirmation_code: registration.confirmation_code,
          name: `${registration.first_name} ${registration.last_name}`,
          session_date: registration.session_date,
          status: 'failed',
          error: err.message,
        });
      }
    }

    return new Response(
      JSON.stringify({
        message: `Processed ${results.length} reminders`,
        targetDate,
        results,
        sent: results.filter((r) => r.status === 'sent').length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Groundwork reminder error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to process reminders' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
