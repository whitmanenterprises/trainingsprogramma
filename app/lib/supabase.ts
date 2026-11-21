import { createClient } from '@supabase/supabase-js';

// Public project URL + anon key (safe to ship to the browser). Data access is guarded by
// Supabase Auth sessions and RLS, not by keeping these values secret.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vwnuumzvosphqsjmzbkb.supabase.co';
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3bnV1bXp2b3NwaHFzam16YmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxODk1ODAsImV4cCI6MjA4OTc2NTU4MH0.9UA0_EKflk3k93iDdK2Gz-AjnEdlzGk3MmslNeSH3Uc';

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Bearer header for our own API routes, which verify the Supabase session server-side.
export async function authHeader(): Promise<Record<string, string>> {
  const { data } = await supabaseClient.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}
