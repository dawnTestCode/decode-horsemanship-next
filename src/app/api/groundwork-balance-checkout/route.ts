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
    const { registrationId, confirmationCode } = await request.json();

    if (!registrationId || !confirmationCode) {
      return NextResponse.json(
        { error: 'Missing registration ID or confirmation code' },
        { status: 400 }
      );
    }

    // Fetch the registration
    const { data: registration, error: fetchError } = await supabase
      .from('groundwork_registrations')
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

    if (registration.status === 'paid_in_full') {
      return NextResponse.json(
        { error: 'Balance already paid' },
        { status: 400 }
      );
    }

    if (registration.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Registration has been cancelled' },
        { status: 400 }
      );
    }

    const balanceDue = registration.balance_due;

    if (balanceDue <= 0) {
      return NextResponse.json(
        { error: 'No balance due' },
        { status: 400 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.decodehorsemanship.com';

    // Create Stripe Checkout session with promo codes enabled
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      allow_promotion_codes: true,
      customer_email: registration.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Groundwork — Balance Payment',
              description: `Remaining balance for ${registration.first_name} ${registration.last_name}`,
            },
            unit_amount: balanceDue,
          },
          quantity: 1,
        },
      ],
      metadata: {
        program: 'groundwork',
        paymentType: 'balance',
        registrationId: registration.id,
        confirmationCode: registration.confirmation_code,
        email: registration.email,
      },
      success_url: `${siteUrl}/groundwork/pay-balance/success?code=${confirmationCode}`,
      cancel_url: `${siteUrl}/groundwork/pay-balance?code=${confirmationCode}`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    return NextResponse.json({ url: session.url });

  } catch (err: unknown) {
    console.error('Groundwork balance checkout error:', err);
    const message = err instanceof Error ? err.message : 'Failed to create checkout session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
