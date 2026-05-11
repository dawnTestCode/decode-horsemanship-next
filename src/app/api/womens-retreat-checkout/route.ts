import { NextResponse } from 'next/server';
import Stripe from 'stripe';

function generateConfirmationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return 'WR-' + Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  try {
    const body = await request.json();
    const {
      programDateId,
      sessionDate,
      firstName,
      lastName,
      email,
      phone,
      ageRange,
      referralSource,
      horseExperience,
      anythingToKnow,
      whatBroughtYou,
      digitalSignature,
      amount,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !programDateId || !sessionDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const confirmationCode = generateConfirmationCode();
    const participantName = `${firstName} ${lastName}`;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.decodehorsemanship.com';

    // Format date for display
    const dateDisplay = new Date(sessionDate + 'T12:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

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
              name: 'What the Horse Knows — Women\'s Retreat',
              description: `${dateDisplay} · Half-day retreat for women`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        program: 'womens-retreat',
        confirmationCode,
        programDateId,
        sessionDate,
        participantName,
        firstName,
        lastName,
        email,
        phone,
        ageRange: ageRange || '',
        referralSource: referralSource || '',
        horseExperience: horseExperience || '',
        anythingToKnow: anythingToKnow || '',
        whatBroughtYou: whatBroughtYou || '',
        digitalSignature,
        amount: String(amount),
      },
      success_url: `${siteUrl}/eal/womens-retreat/success?code=${confirmationCode}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/eal/womens-retreat/register`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });

  } catch (err: unknown) {
    console.error('Women\'s retreat checkout error:', err);
    const message = err instanceof Error ? err.message : 'Failed to create checkout session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
