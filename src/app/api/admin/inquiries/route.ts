import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use anon key for reads (RLS allows select)
const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Use service role for writes (bypasses RLS)
function getServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY not configured');
  }
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey);
}

// GET - Fetch all inquiries (uses anon key - RLS allows select)
export async function GET() {
  try {
    const { data, error } = await supabaseAnon
      .from('contact_inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}

// PATCH - Update an inquiry (status, notes) - requires service role
export async function PATCH(request: NextRequest) {
  try {
    const supabase = getServiceClient();
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing inquiry ID' }, { status: 400 });
    }

    // Add updated_at timestamp
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('contact_inquiries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error updating inquiry:', error);
    const message = error?.message?.includes('not configured')
      ? 'Admin actions require SUPABASE_SERVICE_ROLE_KEY'
      : 'Failed to update inquiry';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE - Delete an inquiry - requires service role
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getServiceClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing inquiry ID' }, { status: 400 });
    }

    const { error } = await supabase
      .from('contact_inquiries')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting inquiry:', error);
    const message = error?.message?.includes('not configured')
      ? 'Admin actions require SUPABASE_SERVICE_ROLE_KEY'
      : 'Failed to delete inquiry';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
