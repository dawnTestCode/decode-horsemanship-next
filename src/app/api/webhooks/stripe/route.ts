import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import {
  sendGroundworkConfirmation,
  sendGroundworkOwnerNotification,
  sendDustLeatherConfirmation,
  sendDustLeatherOwnerNotification,
  sendSummerCampConfirmation,
  sendSummerCampOwnerNotification,
  sendWomensRetreatConfirmation,
  sendWomensRetreatOwnerNotification,
} from '@/lib/email';

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

    // ─── Dust & Leather Booking ────────────────────────────────────────────────
    if (meta.program === 'dust-and-leather') {
      try {
        // Write to dust_and_leather_bookings table
        const { data: booking, error: bookingError } = await supabase
          .from('dust_and_leather_bookings')
          .insert({
            session_id: meta.sessionId || null,
            session_date: meta.sessionDate,
            confirmation_code: meta.confirmationCode,
            name: meta.name,
            email: meta.email,
            phone: meta.phone || null,
            party_size: parseInt(meta.partySize),
            package_type: meta.packageType,
            message: meta.message || null,
            amount_paid: parseInt(meta.amount),
            paid_at: new Date().toISOString(),
            status: 'paid',
            stripe_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent as string,
          })
          .select()
          .single();

        if (bookingError) {
          console.error('Failed to create Dust & Leather booking:', bookingError);
          throw bookingError;
        }

        // Increment enrolled count on the session
        if (meta.sessionId) {
          const { error: sessionError } = await supabase.rpc('increment_dust_leather_enrolled', {
            p_session_id: meta.sessionId,
            p_party_size: parseInt(meta.partySize),
          });

          if (sessionError) {
            console.error('Failed to update session enrolled count:', sessionError);
            // Don't throw - booking was created successfully
          }
        }

        // Send confirmation email to customer
        await sendDustLeatherConfirmation({
          booking,
          confirmationCode: meta.confirmationCode,
        });

        // Send notification to the horseman
        await sendDustLeatherOwnerNotification({
          booking,
        });

        // Mark confirmation sent
        await supabase
          .from('dust_and_leather_bookings')
          .update({ confirmation_sent: true })
          .eq('id', booking.id);

        console.log(`Dust & Leather booking confirmed: ${meta.confirmationCode}`);

      } catch (err: unknown) {
        console.error('Dust & Leather webhook error:', err);
      }

      return NextResponse.json({ received: true });
    }

    // ─── Summer Camp Registration (Deposit) ───────────────────────────────────
    if (meta.program === 'summer-camp' && !meta.paymentType) {
      try {
        // Write to summer_camp_registrations table
        const { data: registration, error: regError } = await supabase
          .from('summer_camp_registrations')
          .insert({
            confirmation_code: meta.confirmationCode,
            tier: meta.tier,
            session_1: meta.session1,
            session_2: meta.session2 || null,
            camper_first_name: meta.camperFirstName,
            camper_last_name: meta.camperLastName,
            camper_dob: meta.camperDob,
            tshirt_size: meta.tshirtSize,
            horse_experience: meta.horseExperience || null,
            referral_source: meta.referralSource || null,
            is_sibling: meta.isSibling === 'true',
            sibling_confirmation_code: meta.siblingConfirmationCode || null,
            parent_name: meta.parentName,
            parent_relationship: meta.parentRelationship,
            parent_email: meta.parentEmail,
            parent_phone: meta.parentPhone,
            emergency_name: meta.emergencyName,
            emergency_relationship: meta.emergencyRelationship,
            emergency_phone: meta.emergencyPhone,
            allergies: meta.allergies || null,
            medical_conditions: meta.medicalConditions || null,
            needs_accommodations: meta.needsAccommodations === 'true',
            accommodations_details: meta.accommodationsDetails || null,
            photo_release: meta.photoRelease === 'true',
            digital_signature: meta.digitalSignature,
            deposit_paid: parseInt(meta.depositAmount),
            balance_due: parseInt(meta.balanceDue),
            balance_paid: 0,
            discount_type: meta.discountType || null,
            status: 'deposit_paid',
            stripe_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent as string,
          })
          .select()
          .single();

        if (regError) {
          console.error('Failed to create Summer Camp registration:', regError);
          throw regError;
        }

        // Send confirmation email to parent
        await sendSummerCampConfirmation({
          registration,
          confirmationCode: meta.confirmationCode,
        });

        // Send notification to owner
        await sendSummerCampOwnerNotification({
          registration,
        });

        // Mark confirmation sent
        await supabase
          .from('summer_camp_registrations')
          .update({ confirmation_sent: true })
          .eq('id', registration.id);

        console.log(`Summer Camp registration confirmed: ${meta.confirmationCode}`);

      } catch (err: unknown) {
        console.error('Summer Camp webhook error:', err);
      }

      return NextResponse.json({ received: true });
    }

    // ─── Summer Camp Balance Payment ──────────────────────────────────────────
    if (meta.program === 'summer-camp' && meta.paymentType === 'balance') {
      try {
        const balanceAmount = parseInt(meta.balanceAmount);

        const { error: updateError } = await supabase
          .from('summer_camp_registrations')
          .update({
            balance_paid: balanceAmount,
            balance_due: 0,
            status: 'paid_in_full',
          })
          .eq('id', meta.registrationId);

        if (updateError) {
          console.error('Failed to update Summer Camp registration:', updateError);
          throw updateError;
        }

        console.log(`Summer Camp balance paid: ${meta.confirmationCode}`);

      } catch (err: unknown) {
        console.error('Summer Camp balance webhook error:', err);
      }

      return NextResponse.json({ received: true });
    }

    // ─── Women's Retreat Registration ─────────────────────────────────────────
    if (meta.program === 'womens-retreat') {
      try {
        // Write to womens_retreat_registrations table
        const { data: registration, error: regError } = await supabase
          .from('womens_retreat_registrations')
          .insert({
            confirmation_code: meta.confirmationCode,
            program_date_id: meta.programDateId,
            session_date: meta.sessionDate,
            first_name: meta.firstName,
            last_name: meta.lastName,
            email: meta.email,
            phone: meta.phone,
            age_range: meta.ageRange || null,
            referral_source: meta.referralSource || null,
            horse_experience: meta.horseExperience || null,
            anything_to_know: meta.anythingToKnow || null,
            what_brought_you: meta.whatBroughtYou || null,
            digital_signature: meta.digitalSignature,
            amount_paid: parseInt(meta.amount),
            status: 'paid',
            stripe_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent as string,
          })
          .select()
          .single();

        if (regError) {
          console.error('Failed to create Women\'s Retreat registration:', regError);
          throw regError;
        }

        // Increment enrolled count on program_dates
        const { error: enrollError } = await supabase.rpc('increment_program_date_enrolled', {
          p_date_id: meta.programDateId,
        });

        if (enrollError) {
          console.error('Failed to increment enrolled count:', enrollError);
          // Don't throw - registration was created successfully
        }

        // Send confirmation email
        await sendWomensRetreatConfirmation({
          registration,
          confirmationCode: meta.confirmationCode,
        });

        // Send owner notification
        await sendWomensRetreatOwnerNotification({
          registration,
        });

        // Mark confirmation sent
        await supabase
          .from('womens_retreat_registrations')
          .update({ confirmation_sent: true })
          .eq('id', registration.id);

        console.log(`Women's Retreat registration confirmed: ${meta.confirmationCode}`);

      } catch (err: unknown) {
        console.error('Women\'s Retreat webhook error:', err);
      }

      return NextResponse.json({ received: true });
    }
  }

  return NextResponse.json({ received: true });
}
