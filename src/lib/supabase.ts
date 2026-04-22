import { createClient } from '@supabase/supabase-js';

// Use environment variables with fallback to hardcoded values for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ejmpxawxwapumcmkdcrx.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqbXB4YXd4d2FwdW1jbWtkY3J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4Nzk0NDMsImV4cCI6MjA4NTQ1NTQ0M30.wvzjwxNVd8H9VEmRxVnQV9neOqdJAVvsF9G1E0WkSUE';

export const supabase = createClient(supabaseUrl, supabaseKey);
