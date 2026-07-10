import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendFoalWaitlistConfirmation } from '@/lib/email';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, heardAbout, interestNotes } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Try to insert into database
    const { error: dbError } = await supabase
      .from('foal_waitlist')
      .insert({
        name,
        email: email.toLowerCase(),
        phone: phone || null,
        heard_about: heardAbout || null,
        interest_notes: interestNotes || null,
      });

    // Handle duplicate email gracefully - don't error, just treat as success
    if (dbError) {
      if (dbError.code === '23505') {
        // Unique constraint violation (duplicate email)
        // Still return success to the user, but skip sending another email
        return NextResponse.json({ success: true, duplicate: true });
      }
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save your information. Please try again.' },
        { status: 500 }
      );
    }

    // Send confirmation email
    try {
      await sendFoalWaitlistConfirmation({
        name,
        email: email.toLowerCase(),
      });
    } catch (emailError) {
      // Log but don't fail the request - they're signed up, email is secondary
      console.error('Failed to send confirmation email:', emailError);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Foal waitlist error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
