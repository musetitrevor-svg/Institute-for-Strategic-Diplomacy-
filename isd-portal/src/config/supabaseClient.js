import { createClient } from '@supabase/supabase-js';

// Hardcoded fallback credentials to guarantee production never evaluates to null
const SUPABASE_URL = "https://tujjezwjsyansvuhhhem.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1amplendqc3lhbnN2dWhoaGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMjk4ODMsImV4cCI6MjA5OTgwNTg4M30.Q-22GbDqGgwfLCp8i66Mpe08Fk6vvlo0C7YIa3MxL2k";

// Directly export the client so it can never be null
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});