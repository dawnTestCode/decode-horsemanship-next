import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

function generateConfirmationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return 'DL-' + Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}

// Fallback pricing if database is unavailable
const FALLBACK_PRICING: Record<string, number> = {
  'day-pass': 72500,
  'stay-for-fire': 89500,
};

const FALLBACK_NAMES: Record<string, string> = {
  'day-pass': 'Day Pass — From sunup to four-thirty',
  'stay-for-fire': 'Stay for the Fire — Until the cards are done',
};

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      partySize,
      packageType,
      message,
      sessionId,
      sessionDate,
    } = body;

    // Validate required fields
    if (!name || !email || !partySize || !packageType || !sessionId || !sessionDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate party size
    const partySizeNum = parseInt(partySize);
    if (isNaN(partySizeNum) || partySizeNum < 1 || partySizeNum > 4) {
      return NextResponse.json(
        { error: 'Party size must be 1, 2, 3, or 4' },
        { status: 400 }
      );
    }

    // Fetch package pricing from database
    const { data: pkg } = await supabase
      .from('dust_leather_packages')
      .select('price, name, description')
      .eq('slug', packageType)
      .eq('active', true)
      .single();

    // Use database price or fallback
    const pricePerPerson = pkg?.price || FALLBACK_PRICING[packageType];
    const packageName = pkg ? `${pkg.name} — ${pkg.description}` : FALLBACK_NAMES[packageType];

    if (!pricePerPerson) {
      return NextResponse.json(
        { error: 'Invalid package type' },
        { status: 400 }
      );
    }

    const confirmationCode = generateConfirmationCode();
    const amount = pricePerPerson * partySizeNum;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.decodehorsemanship.com';

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Dust & Leather — ${packageName}`,
              description: `${partySizeNum} ${partySizeNum === 1 ? 'person' : 'men'} · ${new Date(sessionDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        program: 'dust-and-leather',
        confirmationCode,
        name,
        email,
        phone: phone || '',
        partySize: String(partySizeNum),
        packageType,
        message: message || '',
        amount: String(amount),
        sessionId,
        sessionDate,
      },
      success_url: `${siteUrl}/dust-and-leather/success?code=${confirmationCode}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/dust-and-leather/register`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });

  } catch (err: unknown) {
    console.error('Dust & Leather checkout error:', err);
    const message = err instanceof Error ? err.message : 'Failed to create checkout session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
