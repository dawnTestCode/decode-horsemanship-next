import { NextResponse } from 'next/server';
import Stripe from 'stripe';

function generateConfirmationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return 'DL-' + Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}

const PRICING = {
  'day-pass': 72500,      // $725 in cents
  'stay-for-fire': 89500, // $895 in cents
} as const;

const PACKAGE_NAMES = {
  'day-pass': 'Day Pass — From sunup to four-thirty',
  'stay-for-fire': 'Stay for the Fire — Until the cards are done',
} as const;

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

    // Validate package type
    if (packageType !== 'day-pass' && packageType !== 'stay-for-fire') {
      return NextResponse.json(
        { error: 'Invalid package type' },
        { status: 400 }
      );
    }

    // Validate party size
    const partySizeNum = parseInt(partySize);
    if (isNaN(partySizeNum) || partySizeNum < 2 || partySizeNum > 4) {
      return NextResponse.json(
        { error: 'Party size must be 2, 3, or 4' },
        { status: 400 }
      );
    }

    const confirmationCode = generateConfirmationCode();
    const validPackageType = packageType as keyof typeof PRICING;
    const amount = PRICING[validPackageType];
    const packageName = PACKAGE_NAMES[validPackageType];

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
              description: `${partySizeNum} men · ${new Date(sessionDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`,
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
