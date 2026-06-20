// supabase/functions/dust-leather-reminder/index.ts
// Scheduled function to send reminder emails for Dust & Leather sessions
// Sends reminders on Wednesday before the Saturday (3 days before)
// Can also be triggered manually via HTTP request

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FROM_EMAIL = 'Decode Horsemanship <hello@decodehorsemanship.com>';

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

async function sendReminderEmail({
  booking,
  resendApiKey,
}: {
  booking: {
    name: string;
    email: string;
    session_date: string;
    package_type: string;
    party_size: number;
  };
  resendApiKey: string;
}) {
  const firstName = booking.name.split(' ')[0];
  const isStayForFire = booking.package_type === 'stay-for-fire';
  const partyNote =
    booking.party_size > 1
      ? `You and your group of ${booking.party_size}`
      : 'You';

  const scheduleEnd = isStayForFire
    ? 'until the cards are done'
    : 'around 4:30 PM';

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin: 0; padding: 0; background: #1c1917; font-family: Georgia, serif;">
  <div style="max-width: 560px; margin: 0 auto; background: #1c1917;">

    <!-- Header -->
    <div style="background: #292524; padding: 40px; text-align: center; border-bottom: 2px solid #44403c;">
      <p style="margin: 0 0 8px; color: #a8a29e; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; font-family: monospace;">
        Decode Horsemanship
      </p>
      <h1 style="margin: 0; color: #fafaf9; font-size: 28px; font-weight: 400; font-family: Georgia, serif;">
        Dust <span style="color: #86efac; font-style: italic;">&</span> Leather
      </h1>
      <p style="margin: 12px 0 0; color: #a8a29e; font-size: 16px; font-style: italic;">
        See you Saturday.
      </p>
    </div>

    <!-- Body -->
    <div style="padding: 40px; background: #1c1917;">
      <p style="color: #fafaf9; font-size: 18px; line-height: 1.6; margin: 0 0 24px;">
        ${firstName},
      </p>
      <p style="color: #d6d3d1; font-size: 16px; line-height: 1.7; margin: 0 0 24px;">
        ${partyNote} are booked for Dust & Leather this Saturday, ${formatDate(booking.session_date)}. Here's what you need to know.
      </p>

      <!-- When & Where -->
      <div style="background: #292524; border: 1px solid #44403c; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;">
          <tr>
            <td style="padding: 8px 0; color: #a8a29e; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">When</td>
            <td style="padding: 8px 0; font-size: 14px; color: #fafaf9; text-align: right;">
              Saturday, 8:00 AM – ${scheduleEnd}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #a8a29e; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; border-top: 1px solid #44403c;">Where</td>
            <td style="padding: 8px 0; font-size: 14px; color: #fafaf9; text-align: right; border-top: 1px solid #44403c;">
              <a href="https://maps.google.com/?q=1120+Whippoorwill+Ln,+Chapel+Hill,+NC+27517" style="color: #86efac; text-decoration: none;">
                1120 Whippoorwill Ln<br>Chapel Hill, NC 27517
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #a8a29e; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; border-top: 1px solid #44403c;">Package</td>
            <td style="padding: 8px 0; font-size: 14px; color: #fafaf9; text-align: right; border-top: 1px solid #44403c;">
              ${isStayForFire ? 'Stay for the Fire' : 'Day Pass'}
            </td>
          </tr>
        </table>
      </div>

      <!-- Before You Arrive -->
      <div style="margin-bottom: 24px;">
        <p style="color: #fafaf9; font-size: 14px; font-weight: 600; margin: 0 0 12px; font-family: Arial, sans-serif;">Before You Arrive</p>
        <p style="color: #d6d3d1; font-size: 14px; line-height: 1.6; margin: 0;">
          Please fill out our <a href="https://forms.gle/DszFyex1HKBbLDw6A" style="color: #86efac; text-decoration: none;">liability waiver</a> before you come. It only takes a minute and helps us get started right away.
        </p>
      </div>

      <!-- Getting Through the Gate -->
      <div style="margin-bottom: 24px;">
        <p style="color: #fafaf9; font-size: 14px; font-weight: 600; margin: 0 0 12px; font-family: Arial, sans-serif;">Getting Through the Gate</p>
        <p style="color: #d6d3d1; font-size: 14px; line-height: 1.6; margin: 0;">
          There's an automatic gate at the entrance. As you approach, you'll see an orange stick on the left side of the driveway. Drive slowly and move over to the left to hit the sensor—the gate will open slowly and close automatically behind you.
        </p>
      </div>

      <!-- Finding the Barn -->
      <div style="margin-bottom: 24px;">
        <p style="color: #fafaf9; font-size: 14px; font-weight: 600; margin: 0 0 12px; font-family: Arial, sans-serif;">Finding the Barn</p>
        <p style="color: #d6d3d1; font-size: 14px; line-height: 1.6; margin: 0;">
          Once through the gate, the barn is the first building on your left (big metal building). Park anywhere in the gravel lot, then walk around the right side of the building and come in through the big barn aisle doors.
        </p>
      </div>

      <!-- What to Wear -->
      <div style="margin-bottom: 24px;">
        <p style="color: #fafaf9; font-size: 14px; font-weight: 600; margin: 0 0 12px; font-family: Arial, sans-serif;">What to Wear</p>
        <ul style="color: #d6d3d1; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0;">
          <li>Boots or sturdy work shoes</li>
          <li>Long pants (jeans, work pants)</li>
          <li>A hat with a brim</li>
          <li>Layers — mornings are cool</li>
        </ul>
      </div>

      <!-- What to Bring -->
      <div style="margin-bottom: 24px;">
        <p style="color: #fafaf9; font-size: 14px; font-weight: 600; margin: 0 0 12px; font-family: Arial, sans-serif;">What to Bring</p>
        <ul style="color: #d6d3d1; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0;">
          <li>Water bottle</li>
          <li>Sunglasses and sunscreen</li>
          <li>A change of clothes for the drive home</li>
        </ul>
      </div>

      <!-- The Day -->
      <div style="margin-bottom: 24px;">
        <p style="color: #fafaf9; font-size: 14px; font-weight: 600; margin: 0 0 12px; font-family: Arial, sans-serif;">The Day</p>
        <p style="color: #d6d3d1; font-size: 14px; line-height: 1.6; margin: 0;">
          Coffee at 8. Horse work, farm work, lunch over coals, leather bench, rope and axe. ${isStayForFire ? "Then supper, whiskey, cigars, and cards by the fire. We'll wrap when the cards do." : "You'll head home around 4:30."}
        </p>
      </div>

      <!-- Questions -->
      <div style="border-top: 1px solid #44403c; padding-top: 24px; margin-top: 32px;">
        <p style="color: #d6d3d1; font-size: 14px; margin: 0;">
          Questions? Text me at <a href="sms:9192442647" style="color: #86efac; text-decoration: none;">(919) 244-2647</a> or reply to this email.
        </p>
        <p style="color: #a8a29e; font-size: 14px; margin: 16px 0 0;">
          — Dawn<br>
          <a href="mailto:hello@decodehorsemanship.com" style="color: #86efac;">hello@decodehorsemanship.com</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #292524; padding: 20px; text-align: center; border-top: 1px solid #44403c;">
      <p style="color: #78716c; font-size: 12px; margin: 0; font-family: monospace; letter-spacing: 1px;">
        Dust & Leather · Decode Horsemanship · Chapel Hill, NC
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
      to: booking.email,
      subject: `See you Saturday — Dust & Leather`,
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

    // Find bookings with sessions 2-4 days away that haven't received a reminder
    // Note: dust_and_leather_bookings doesn't have reminder_sent_at column yet,
    // so we need to add it or track differently
    const { data: bookings, error: fetchError } = await supabase
      .from('dust_and_leather_bookings')
      .select('*')
      .gte('session_date', twoDaysOut.toISOString().split('T')[0])
      .lte('session_date', fourDaysOut.toISOString().split('T')[0])
      .eq('status', 'paid')
      .is('reminder_sent_at', null);

    if (fetchError) {
      throw fetchError;
    }

    if (!bookings || bookings.length === 0) {
      return new Response(
        JSON.stringify({
          message: 'No bookings need reminders today',
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
    for (const booking of bookings) {
      try {
        await sendReminderEmail({ booking, resendApiKey });

        // Mark reminder as sent
        await supabase
          .from('dust_and_leather_bookings')
          .update({ reminder_sent_at: new Date().toISOString() })
          .eq('id', booking.id);

        results.push({
          confirmation_code: booking.confirmation_code,
          name: booking.name,
          session_date: booking.session_date,
          status: 'sent',
        });
      } catch (err: any) {
        results.push({
          confirmation_code: booking.confirmation_code,
          name: booking.name,
          session_date: booking.session_date,
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
    console.error('Dust & Leather reminder error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to process reminders' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
