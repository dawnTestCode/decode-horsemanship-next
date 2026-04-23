import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { sendGroundworkConfirmation, sendGroundworkOwnerNotification } from '@/lib/email';

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata!;

    // ─── Groundwork Registration (Deposit) ──────────────────────────────────
    if (meta.program === 'groundwork' && !meta.paymentType) {
      try {
        // Write to groundwork_registrations table
        const { data: registration, error: regError } = await supabase
          .from('groundwork_registrations')
          .insert({
            confirmation_code: meta.confirmationCode,
            session_date: meta.sessionDate || 'TBA',
            first_name: meta.participantName.split(' ')[0],
            last_name: meta.participantName.split(' ').slice(1).join(' '),
            email: meta.email,
            phone: meta.phone,
            age_range: meta.ageRange || null,
            referral_source: meta.referralSource || null,
            horse_experience: meta.horseExperience || null,
            anything_to_know: meta.anythingToKnow || null,
            what_brought_you: meta.whatBroughtYou || null,
            deposit_amount: parseInt(meta.depositAmount),
            total_price: parseInt(meta.totalPrice),
            balance_due: parseInt(meta.balanceDue),
            deposit_paid_at: new Date().toISOString(),
            status: 'deposit_paid',
            stripe_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent as string,
          })
          .select()
          .single();

        if (regError) {
          console.error('Failed to create Groundwork registration:', regError);
          throw regError;
        }

        // Send confirmation email to participant
        await sendGroundworkConfirmation({
          registration,
          confirmationCode: meta.confirmationCode,
        });

        // Send notification to Groundwork email
        await sendGroundworkOwnerNotification({
          registration,
          depositAmount: parseInt(meta.depositAmount),
          balanceDue: parseInt(meta.balanceDue),
        });

        // Mark confirmation sent
        await supabase
          .from('groundwork_registrations')
          .update({ confirmation_sent: true })
          .eq('id', registration.id);

        console.log(`Groundwork registration confirmed: ${meta.confirmationCode}`);

      } catch (err: unknown) {
        console.error('Groundwork webhook error:', err);
      }

      return NextResponse.json({ received: true });
    }

    // ─── Groundwork Balance Payment ───────────────────────────────────────────
    if (meta.program === 'groundwork' && meta.paymentType === 'balance') {
      try {
        const { error: updateError } = await supabase
          .from('groundwork_registrations')
          .update({
            balance_due: 0,
            balance_paid_at: new Date().toISOString(),
            status: 'paid_in_full',
          })
          .eq('id', meta.registrationId);

        if (updateError) {
          console.error('Failed to update Groundwork registration:', updateError);
          throw updateError;
        }

        console.log(`Groundwork balance paid: ${meta.confirmationCode}`);

      } catch (err: unknown) {
        console.error('Groundwork balance webhook error:', err);
      }

      return NextResponse.json({ received: true });
    }

    // Handle other programs here if needed...
  }

  return NextResponse.json({ received: true });
}
