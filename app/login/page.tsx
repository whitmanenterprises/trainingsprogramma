'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push('/');
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'signup') {
      const { error: err } = await supabase.auth.signUp({ email, password });
      if (err) { setError(err.message); setLoading(false); return; }
      setError('Account aangemaakt! Probeer nu in te loggen.');
      setMode('login');
      setLoading(false);
      return;
    }

    if (email !== 'mingusvogel@gmail.com') {
      setError('Geen toegang voor dit e-mailadres.');
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }
    router.push('/');
  };

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
          <button type="submit" disabled={loading} style={{ width:'100%',padding:14,borderRadius:12,background:loading?'#d1d5db':'#22c55e',color:loading?'#9ca3af':'#fff',fontSize:15,fontWeight:600,border:'none',cursor:loading?'not-allowed':'pointer',marginBottom:10 }}>
            {loading?'Laden...': mode==='signup'?'Account aanmaken':'Inloggen'}
          </button>
          <button type="button" onClick={()=>{setMode(mode==='login'?'signup':'login');setError('')}} disabled={loading} style={{ width:'100%',padding:14,borderRadius:12,background:'transparent',color:'#15803d',fontSize:14,fontWeight:600,border:'1px solid #bbf7d0',cursor:loading?'not-allowed':'pointer' }}>
            {mode==='login'?'Nieuw account aanmaken':'Terug naar inloggen'}
          </button>
        </form>
      </div>
    </div>
  );
}
