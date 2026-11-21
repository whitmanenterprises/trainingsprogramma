import { SUPABASE_ANON_KEY, SUPABASE_URL } from './supabase';

const DEFAULT_ALLOWED_EMAILS = ['mail@mingusvogel.com', 'mingusvogel@gmail.com'];

function allowedEmails() {
  const fromEnv = (process.env.APP_ALLOWED_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  return new Set(fromEnv.length ? fromEnv : DEFAULT_ALLOWED_EMAILS);
}

export type AuthResult = { user: { id: string; email: string } } | { status: number; error: string };

// Verifies the request's Supabase access token and checks the email against the allowlist.
export async function requireAllowedUser(request: Request): Promise<AuthResult> {
  const match = /^Bearer\s+(.+)$/i.exec(request.headers.get('authorization')?.trim() ?? '');
  if (!match) return { status: 401, error: 'Niet ingelogd.' };

  let response: Response;
  try {
    response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${match[1]}` },
      cache: 'no-store',
    });
  } catch {
    return { status: 502, error: 'Inlogcontrole mislukt.' };
  }
  if (!response.ok) return { status: 401, error: 'Sessie ongeldig of verlopen. Log opnieuw in.' };

  const user = (await response.json().catch(() => null)) as { id?: string; email?: string } | null;
  const email = user?.email?.toLowerCase() ?? '';
  if (!user?.id || !email || !allowedEmails().has(email)) return { status: 403, error: 'Geen toegang.' };
  return { user: { id: user.id, email } };
}
