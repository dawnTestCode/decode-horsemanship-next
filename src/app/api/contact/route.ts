import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendContactInquiryNotification } from '@/lib/email';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, inquiry_type, horse_name, message } = body;

    // Validate required fields
    if (!name || !email || !inquiry_type || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert into database
    const { error: dbError } = await supabase
      .from('contact_inquiries')
      .insert({
        name,
        email,
        phone: phone || null,
        inquiry_type,
        horse_name: horse_name || null,
        message,
        status: 'unread',
      });

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save inquiry' },
        { status: 500 }
      );
    }

    // Send notifications (email + SMS)
    try {
      await sendContactInquiryNotification({
        inquiry: { name, email, phone, inquiry_type, horse_name, message },
      });
    } catch (notifyError) {
      // Log but don't fail the request - the inquiry was saved
      console.error('Notification error:', notifyError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
