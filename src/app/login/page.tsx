"use client";
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LoginSchema } from '@/lib/zod';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const result = LoginSchema.safeParse({ email, password });
    if (!result.success) {
      const errors: { email?: string; password?: string } = {};
      result.error.errors.forEach(err => {
        if (err.path[0] === 'email') errors.email = err.message;
        if (err.path[0] === 'password') errors.password = err.message;
      });
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    
    try {
      const res = await signIn('credentials', { email, password, redirect: false });
      if (res?.error) {
        setError('Credenciales inválidas. Verifica tu email y contraseña.');
      } else {
        router.push('/exercises');
      }
    } catch (err) {
      setError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-md w-full">
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} suppressHydrationWarning>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
              Iniciar Sesión
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)]">
              Bienvenido de vuelta a <span className="font-semibold">Arqui ASM</span>
            </p>
          </div>

          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-8">
            <form className="space-y-6" onSubmit={onSubmit}>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-primary)]">
                  Correo Electrónico
                </label>
                <input 
                  id="email"
                  type="email"
                  className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all duration-200" 
                  placeholder="tu@email.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                {fieldErrors.email && (
                  <p className="text-[var(--color-error)] text-sm">{fieldErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-primary)]">
                  Contraseña
                </label>
                <input 
                  id="password"
                  type="password" 
                  className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all duration-200" 
                  placeholder="Tu contraseña segura" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                {fieldErrors.password && (
                  <p className="text-[var(--color-error)] text-sm">{fieldErrors.password}</p>
                )}
              </div>

              {error && (
                <div className="bg-[var(--color-error-bg)] border border-[var(--color-error)] rounded-xl p-4">
                  <p className="text-[var(--color-error)] text-sm font-medium">{error}</p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading || !email || !password}
                className="w-full bg-[var(--color-accent)] text-[var(--color-bg)] font-semibold py-3 px-6 rounded-xl text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:opacity-90"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-[var(--color-bg)] border-t-transparent rounded-full"></div>
                    Iniciando sesión...
                  </>
                ) : (
                  'Entrar'
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
              <div className="text-center">
                <p className="text-[var(--color-text-secondary)]">
                  ¿Aún no tienes cuenta?{' '}
                  <Link 
                    href="/register" 
                    className="font-semibold text-[var(--color-accent)] hover:opacity-80 transition-all duration-200"
                  >
                    Regístrate
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200 font-medium"
            >
              <span>←</span>
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
