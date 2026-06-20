'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FadeIn } from '@/animations';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al iniciar sesión');
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-root)] p-4 relative z-10 before:content-[''] before:fixed before:inset-0 before:bg-[radial-gradient(ellipse_80%_60%_at_20%_10%,hsla(265,50%,30%,0.08),transparent),radial-gradient(ellipse_60%_50%_at_80%_80%,hsla(42,65%,55%,0.04),transparent)] before:-z-10">
      <FadeIn className="w-full max-w-[420px] bg-[#1a1c25]/60 backdrop-blur-[20px] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
        
        <div className="text-center mb-8">
          <div className="font-display text-3xl font-extrabold tracking-widest bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">INTRAMPO</div>
          <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">Iglesia Maranatha — Intranet</div>
        </div>

        {error && <FadeIn className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm text-center mb-6" duration={0.3}>{error}</FadeIn>}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider" htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-3 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider" htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className="w-full bg-[#14161f] border border-white/10 text-white rounded-lg px-4 py-3 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="w-full relative overflow-hidden bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-3.5 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:pointer-events-none mt-2 flex items-center justify-center gap-2"
            disabled={loading}
            id="login-submit"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-900/20 border-t-gray-900 rounded-full animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-[0.78rem] text-gray-500">
          Usa tus credenciales de MPOLOG para acceder
        </p>
      </FadeIn>
    </div>
  );
}
