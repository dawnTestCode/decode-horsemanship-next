import { NextResponse } from 'next/server';
import Stripe from 'stripe';

function generateConfirmationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return 'GW-' + Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  try {
    const body = await request.json();
    const {
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
      totalPrice,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const confirmationCode = generateConfirmationCode();
    const participantName = `${firstName} ${lastName}`;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.decodehorsemanship.com';

    // Create Stripe Checkout session - full payment
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Groundwork — A Half-Day for Men',
              description: 'Second Saturday of the month. 8:30 AM – 12:30 PM. Lunch included.',
            },
            unit_amount: totalPrice,
          },
          quantity: 1,
        },
      ],
      metadata: {
        program: 'groundwork',
        confirmationCode,
        sessionDate: sessionDate || 'TBA',
        participantName,
        email,
        phone,
        ageRange: ageRange || '',
        referralSource: referralSource || '',
        horseExperience: horseExperience || '',
        anythingToKnow: anythingToKnow || '',
        whatBroughtYou: whatBroughtYou || '',
        totalPrice: String(totalPrice),
      },
      success_url: `${siteUrl}/groundwork/success?code=${confirmationCode}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/groundwork/register`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });

  } catch (err: unknown) {
    console.error('Groundwork checkout error:', err);
    const message = err instanceof Error ? err.message : 'Failed to create checkout session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
