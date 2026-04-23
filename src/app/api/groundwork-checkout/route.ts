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
      depositAmount,
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
    const balanceDue = totalPrice - depositAmount;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.decodehorsemanship.com';

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      allow_promotion_codes: true,
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Groundwork — A Day with Horses',
              description: `Deposit to hold your spot — balance of $${(balanceDue / 100).toFixed(0)} due 14 days before your session`,
            },
            unit_amount: depositAmount,
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
        depositAmount: String(depositAmount),
        totalPrice: String(totalPrice),
        balanceDue: String(balanceDue),
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
