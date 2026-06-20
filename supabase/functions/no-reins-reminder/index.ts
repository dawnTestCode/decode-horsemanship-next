// supabase/functions/no-reins-reminder/index.ts
// Scheduled function to send reminder emails for No Reins sessions
// Sends reminders on Wednesday before the Saturday workshop (3 days before)
// Can also be triggered manually via HTTP request

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FROM_EMAIL = 'Decode Horsemanship <hello@decodehorsemanship.com>';

async function sendReminderEmail({
  registration,
  resendApiKey,
}: {
  registration: {
    first_name: string;
    email: string;
    session_date: string;
  };
  resendApiKey: string;
}) {
  const firstName = registration.first_name;

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
      <h1 style="margin: 0; color: #fff; font-size: 24px; font-weight: 700;">
        No Reins
      </h1>
      <p style="margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px; font-style: italic;">
        See You Saturday!
      </p>
    </div>

    <!-- Body -->
    <div style="padding: 40px; background: #292524;">
      <p style="color: #fafaf9; font-size: 18px; line-height: 1.6; margin: 0 0 24px;">
        Hi ${firstName}!
      </p>
      <p style="color: #d6d3d1; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
        We're excited to see you this Saturday for the No Reins workshop! Here are the details for the day:
      </p>

      <!-- When & Where -->
      <div style="background: #1c1917; border: 1px solid #44403c; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #a8a29e; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">When</td>
            <td style="padding: 8px 0; font-size: 14px; color: #fafaf9; text-align: right;">
              Saturday, 10am – 2pm
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #a8a29e; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; border-top: 1px solid #44403c;">Where</td>
            <td style="padding: 8px 0; font-size: 14px; color: #fafaf9; text-align: right; border-top: 1px solid #44403c;">
              <a href="https://maps.google.com/?q=1120+Whippoorwill+Ln,+Chapel+Hill,+NC+27517" style="color: #f87171; text-decoration: none;">
                1120 Whippoorwill Ln<br>Chapel Hill, NC 27517
              </a>
            </td>
          </tr>
        </table>
        <p style="color: #a8a29e; font-size: 13px; font-style: italic; margin: 12px 0 0; text-align: center;">
          If you're driving along power lines on the driveway, you're in the right place!
        </p>
      </div>

      <!-- Getting Through the Gate -->
      <div style="margin-bottom: 24px;">
        <p style="color: #fafaf9; font-size: 14px; font-weight: 600; margin: 0 0 12px;">Getting Through the Gate</p>
        <p style="color: #d6d3d1; font-size: 14px; line-height: 1.6; margin: 0;">
          There's an automatic gate at the entrance. As you approach, you'll see an orange stick on the left side of the driveway. Drive slowly and move over to the left to hit the sensor—the gate will open slowly and close automatically behind you.
        </p>
      </div>

      <!-- Finding the Barn -->
      <div style="margin-bottom: 24px;">
        <p style="color: #fafaf9; font-size: 14px; font-weight: 600; margin: 0 0 12px;">Finding the Barn</p>
        <p style="color: #d6d3d1; font-size: 14px; line-height: 1.6; margin: 0;">
          Once through the gate, the barn is the first building on your left (big metal building). Park anywhere in the gravel lot, then walk around the right side of the building and come in through the big barn aisle doors.
        </p>
      </div>

      <!-- What to Wear -->
      <div style="margin-bottom: 24px;">
        <p style="color: #fafaf9; font-size: 14px; font-weight: 600; margin: 0 0 12px;">What to Wear</p>
        <ul style="color: #d6d3d1; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0;">
          <li>Long pants</li>
          <li>Closed-toe shoes</li>
        </ul>
      </div>

      <!-- What to Bring -->
      <div style="margin-bottom: 24px;">
        <p style="color: #fafaf9; font-size: 14px; font-weight: 600; margin: 0 0 12px;">What to Bring</p>
        <ul style="color: #d6d3d1; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0;">
          <li>Water bottle (we'll also have refreshments)</li>
          <li>A jacket if it might be chilly</li>
        </ul>
      </div>

      <!-- Lunch -->
      <div style="margin-bottom: 24px;">
        <p style="color: #fafaf9; font-size: 14px; font-weight: 600; margin: 0 0 12px;">Lunch</p>
        <p style="color: #d6d3d1; font-size: 14px; line-height: 1.6; margin: 0;">
          We'll have lunch together during the workshop.
        </p>
      </div>

      <!-- After the Workshop -->
      <div style="margin-bottom: 24px;">
        <p style="color: #fafaf9; font-size: 14px; font-weight: 600; margin: 0 0 12px;">After the Workshop</p>
        <p style="color: #d6d3d1; font-size: 14px; line-height: 1.6; margin: 0;">
          You're welcome to stay after the workshop wraps up if you'd like to meet some of our other horses, spend extra time with them, or even do some grooming!
        </p>
      </div>

      <!-- Questions -->
      <div style="border-top: 1px solid #44403c; padding-top: 20px;">
        <p style="color: #d6d3d1; font-size: 14px; margin: 0;">
          Let me know if you have any questions. See you Saturday!
        </p>
        <p style="color: #a8a29e; font-size: 14px; margin: 16px 0 0;">
          — Dawn<br>
          <a href="mailto:dawn@decodehorsemanship.com" style="color: #f87171;">dawn@decodehorsemanship.com</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #1c1917; padding: 20px; text-align: center; border-top: 1px solid #44403c;">
      <p style="color: #78716c; font-size: 12px; margin: 0;">
        Decode Horsemanship · Chapel Hill, NC
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
      subject: `See you Saturday! — No Reins Workshop`,
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

    // Calculate target date range
    // We want to send on Wednesday for Saturday sessions (3 days out)
    // But also allow 2-4 days to catch any edge cases
    const today = new Date();
    const twoDaysOut = new Date(today);
    twoDaysOut.setDate(twoDaysOut.getDate() + 2);
    const fourDaysOut = new Date(today);
    fourDaysOut.setDate(fourDaysOut.getDate() + 4);

    // Find registrations with sessions 2-4 days away that haven't received a reminder
    const { data: registrations, error: fetchError } = await supabase
      .from('womens_retreat_registrations')
      .select('*')
      .gte('session_date', twoDaysOut.toISOString().split('T')[0])
      .lte('session_date', fourDaysOut.toISOString().split('T')[0])
      .eq('status', 'paid')
      .is('reminder_sent_at', null);

    if (fetchError) {
      throw fetchError;
    }

    if (!registrations || registrations.length === 0) {
      return new Response(
        JSON.stringify({
          message: 'No registrations need reminders today',
          dateRange: {
            from: twoDaysOut.toISOString().split('T')[0],
            to: fourDaysOut.toISOString().split('T')[0],
          },
          sent: 0,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send reminders
    const results = [];
    for (const registration of registrations) {
      try {
        await sendReminderEmail({ registration, resendApiKey });

        // Mark reminder as sent
        await supabase
          .from('womens_retreat_registrations')
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
        dateRange: {
          from: twoDaysOut.toISOString().split('T')[0],
          to: fourDaysOut.toISOString().split('T')[0],
        },
        results,
        sent: results.filter((r) => r.status === 'sent').length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('No Reins reminder error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to process reminders' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
