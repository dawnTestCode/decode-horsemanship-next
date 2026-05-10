import { NextResponse } from 'next/server';
import Stripe from 'stripe';

function generateConfirmationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return 'SC-' + Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  try {
    const body = await request.json();
    const {
      tier,
      session1,
      session2,
      addSecondSession,
      camperFirstName,
      camperLastName,
      camperDob,
      tshirtSize,
      horseExperience,
      referralSource,
      isSibling,
      siblingConfirmationCode,
      parentName,
      parentRelationship,
      parentEmail,
      parentPhone,
      emergencyName,
      emergencyRelationship,
      emergencyPhone,
      allergies,
      medicalConditions,
      needsAccommodations,
      accommodationsDetails,
      photoRelease,
      digitalSignature,
      sessionCount,
      depositAmount,
      totalPrice,
      isEarlyBird,
      discountType,
    } = body;

    // Validate required fields
    if (!camperFirstName || !camperLastName || !parentEmail || !parentPhone || !session1) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const confirmationCode = generateConfirmationCode();
    const camperName = `${camperFirstName} ${camperLastName}`;
    const balanceDue = totalPrice - depositAmount;
    const tierLabel = tier === 'explorers' ? 'Explorers (6-9)' : 'Trailblazers (10-14)';

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.decodehorsemanship.com';

    // Build session description
    let sessionDesc = `${sessionCount} session${sessionCount > 1 ? 's' : ''}`;
    if (discountType) {
      const discountLabels: Record<string, string> = {
        early_bird: 'Early bird discount applied',
        sibling: 'Sibling discount applied',
        early_bird_sibling: 'Early bird + sibling discounts applied',
      };
      sessionDesc += ` — ${discountLabels[discountType] || ''}`;
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: parentEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Summer Camp — ${tierLabel}`,
              description: `Deposit for ${camperName} — ${sessionDesc}. Balance of $${(balanceDue / 100).toFixed(0)} due 2 weeks before session.`,
            },
            unit_amount: depositAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        program: 'summer-camp',
        confirmationCode,
        tier,
        session1,
        session2: addSecondSession && session2 ? session2 : '',
        sessionCount: String(sessionCount),
        camperName,
        camperFirstName,
        camperLastName,
        camperDob,
        tshirtSize,
        horseExperience: horseExperience || '',
        referralSource: referralSource || '',
        isSibling: String(isSibling),
        siblingConfirmationCode: siblingConfirmationCode || '',
        parentName,
        parentRelationship,
        parentEmail,
        parentPhone,
        emergencyName,
        emergencyRelationship,
        emergencyPhone,
        allergies: allergies || '',
        medicalConditions: medicalConditions || '',
        needsAccommodations: String(needsAccommodations),
        accommodationsDetails: accommodationsDetails || '',
        photoRelease: String(photoRelease),
        digitalSignature,
        depositAmount: String(depositAmount),
        totalPrice: String(totalPrice),
        balanceDue: String(balanceDue),
        isEarlyBird: String(isEarlyBird),
        discountType: discountType || '',
      },
      success_url: `${siteUrl}/summer-camp/success?code=${confirmationCode}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/summer-camp/register`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });

  } catch (err: unknown) {
    console.error('Summer camp checkout error:', err);
    const message = err instanceof Error ? err.message : 'Failed to create checkout session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
