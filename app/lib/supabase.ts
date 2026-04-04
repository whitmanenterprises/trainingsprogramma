import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _sb: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_sb) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vwnuumzvosphqsjmzbkb.supabase.co';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    _sb = createClient(url, key);
  }
  return _sb;
}

export const supabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getSupabase()[prop as keyof SupabaseClient];
  },
});
