import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const body = await request.json();
    const { registrationId, confirmationCode } = body;

    if (!registrationId || !confirmationCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch the registration
    const { data: registration, error: fetchError } = await supabase
      .from('summer_camp_registrations')
      .select('*')
      .eq('id', registrationId)
      .eq('confirmation_code', confirmationCode)
      .single();

    if (fetchError || !registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    // Calculate remaining balance
    const remainingBalance = registration.balance_due - (registration.balance_paid || 0);

    if (remainingBalance <= 0) {
      return NextResponse.json(
        { error: 'Balance already paid' },
        { status: 400 }
      );
    }

    const camperName = `${registration.camper_first_name} ${registration.camper_last_name}`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.decodehorsemanship.com';

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: registration.parent_email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Summer Camp — Balance Payment',
              description: `Remaining balance for ${camperName}`,
            },
            unit_amount: remainingBalance,
          },
          quantity: 1,
        },
      ],
      metadata: {
        program: 'summer-camp',
        paymentType: 'balance',
        registrationId,
        confirmationCode,
        camperName,
        balanceAmount: String(remainingBalance),
      },
      success_url: `${siteUrl}/summer-camp/pay-balance/success?code=${confirmationCode}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/summer-camp/pay-balance?code=${confirmationCode}`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });

  } catch (err: unknown) {
    console.error('Summer camp balance checkout error:', err);
    const message = err instanceof Error ? err.message : 'Failed to create checkout session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
