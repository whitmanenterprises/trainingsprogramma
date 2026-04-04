'use client';
// login page for knie training app

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '../lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (email !== 'mingusvogel@gmail.com') {
      setError('Geen toegang voor dit e-mailadres.');
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabaseClient.auth.signInWithPassword({ email, password });

    if (signInError) {
      if (signInError.message.includes('Invalid login credentials')) {
        // Try signing up
        const { error: signUpError } = await supabaseClient.auth.signUp({ email, password });
        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }
        // Sign in after signup
        const { error: secondSignIn } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (secondSignIn) {
          setError(secondSignIn.message);
          setLoading(false);
          return;
        }
      } else {
        setError(signInError.message);
        setLoading(false);
        return;
      }
    }

    router.push('/');
  };

  const C = { bg: '#fafaf9', card: '#fff', border: '#e7e5e4', text: '#1c1917', sub: '#78716c', light: '#a8a29e', green: '#22c55e', greenBg: '#f0fdf4', greenBorder: '#bbf7d0', greenDark: '#15803d' };

  return (
    <div style={{ fontFamily: "'Instrument Sans','SF Pro Display',-apple-system,sans-serif", background: C.bg, color: C.text, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box}
        input{outline:none}
        input:focus{border-color:#22c55e!important}
      `}</style>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: C.light, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Knie Revalidatie</div>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.3 }}>Inloggen</div>
        </div>

        <form onSubmit={handleSubmit} style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.sub, marginBottom: 6, letterSpacing: 0.3 }}>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, color: C.text, background: C.bg, transition: 'border-color 0.2s' }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.sub, marginBottom: 6, letterSpacing: 0.3 }}>Wachtwoord</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, color: C.text, background: C.bg, transition: 'border-color 0.2s' }}
            />
          </div>

          {error && (
            <div style={{ padding: '10px 12px', borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: 14, borderRadius: 12, background: loading ? 'rgba(34,197,94,.3)' : C.green, color: loading ? C.greenDark : '#fff', fontSize: 15, fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all .2s', marginBottom: 10 }}
          >
            {loading ? 'Laden...' : 'Inloggen'}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={async () => {
              setError('');
              setLoading(true);
              const { error: signUpError } = await supabaseClient.auth.signUp({ email, password });
              if (signUpError) {
                setError(signUpError.message);
                setLoading(false);
                return;
              }
              // After signup, try to sign in
              const { error: signInError2 } = await supabaseClient.auth.signInWithPassword({ email, password });
              if (signInError2) {
                setError('Account aangemaakt! Check je e-mail voor verificatie, probeer dan opnieuw in te loggen.');
                setLoading(false);
                return;
              }
              router.push('/');
            }}
            style={{ width: '100%', padding: 14, borderRadius: 12, background: 'transparent', color: C.greenDark, fontSize: 14, fontWeight: 600, border: `1px solid ${C.greenBorder}`, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all .2s' }}
          >
            {loading ? 'Laden...' : 'Account aanmaken'}
          </button>
        </form>
      </div>
    </div>
  );
}
