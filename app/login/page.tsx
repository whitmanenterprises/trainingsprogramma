'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sb, setSb] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    if (sb) {
      sb.auth.getSession().then(({ data }) => {
        if (data.session) router.push('/');
      });
    }
  }, [sb, router]);

  const getSupabase = useCallback(async () => {
    if (sb) return sb;
    const { createClient } = await import('@supabase/supabase-js');
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    setSb(client);
    return client;
  }, [sb]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (email !== 'mingusvogel@gmail.com') {
      setError('Geen toegang voor dit e-mailadres.');
      setLoading(false);
      return;
    }

    const client = await getSupabase();
    const { error: signInError } = await client.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }
    router.push('/');
  }, [email, password, getSupabase, router]);

  return (
    <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#fafaf9',fontFamily:'system-ui,sans-serif',padding:20 }}>
      <div style={{ width:'100%',maxWidth:380 }}>
        <div style={{ textAlign:'center',marginBottom:32 }}>
          <div style={{ fontSize:11,color:'#a8a29e',letterSpacing:1.5,textTransform:'uppercase',marginBottom:8 }}>Knie Revalidatie</div>
          <div style={{ fontSize:24,fontWeight:700 }}>Inloggen</div>
        </div>
        <form onSubmit={handleSubmit} style={{ background:'#fff',borderRadius:16,border:'1px solid #e7e5e4',padding:24 }}>
          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block',fontSize:12,fontWeight:600,color:'#78716c',marginBottom:6 }}>E-mail</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required style={{ width:'100%',padding:'10px 12px',borderRadius:10,border:'1px solid #e7e5e4',fontSize:14,outline:'none' }} />
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ display:'block',fontSize:12,fontWeight:600,color:'#78716c',marginBottom:6 }}>Wachtwoord</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required style={{ width:'100%',padding:'10px 12px',borderRadius:10,border:'1px solid #e7e5e4',fontSize:14,outline:'none' }} />
          </div>
          {error && <div style={{ padding:'10px 12px',borderRadius:10,background:'#fef2f2',border:'1px solid #fecaca',color:'#dc2626',fontSize:13,marginBottom:16 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width:'100%',padding:14,borderRadius:12,background:loading?'#d1d5db':'#22c55e',color:loading?'#9ca3af':'#fff',fontSize:15,fontWeight:600,border:'none',cursor:loading?'not-allowed':'pointer' }}>
            {loading?'Laden...':'Inloggen'}
          </button>
        </form>
      </div>
    </div>
  );
}
