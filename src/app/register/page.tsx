"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { RegisterSchema } from '@/lib/zod';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!email) { setEmailError(null); return; }
    const result = RegisterSchema.shape.email.safeParse(email);
    setEmailError(!result.success ? (result.error.errors[0]?.message || 'Email inválido') : null);
  }, [email]);

  useEffect(() => {
    if (!password) { setPasswordErrors([]); return; }
    const result = RegisterSchema.shape.password.safeParse(password);
    setPasswordErrors(!result.success ? result.error.errors.map(e => e.message) : []);
  }, [password]);

  useEffect(() => {
    if (!confirmPassword) { setConfirmPasswordError(null); return; }
    setConfirmPasswordError(password && confirmPassword !== password ? 'Las contraseñas no coinciden' : null);
  }, [password, confirmPassword]);

  const hasNumber = (str: string) => str.split('').some(c => c >= '0' && c <= '9');
  const hasUppercase = (str: string) => str.split('').some(c => c >= 'A' && c <= 'Z');

  const passwordRules = [
    { label: 'Mínimo 8 caracteres', valid: password.length >= 8 },
    { label: 'Al menos 1 número', valid: hasNumber(password) },
    { label: 'Al menos 1 mayúscula', valid: hasUppercase(password) },
  ];

  const isFormValid = email && password && confirmPassword && !emailError && passwordErrors.length === 0 && !confirmPasswordError;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    const result = RegisterSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.errors[0]?.message || 'Datos inválidos');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden. Verifica e inténtalo de nuevo.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.error || 'No se pudo crear la cuenta. Inténtalo de nuevo.');
      } else {
        setSuccess(true);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError('Error de conexión. Verifica tu internet e inténtalo de nuevo.');
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
              Crear Cuenta
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)]">
              Únete a <span className="font-semibold text-[var(--color-text-primary)]">Arqui ASM</span> y comienza a aprender
            </p>
          </div>

          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-8">
            {success ? (
              <div className="text-center space-y-6">
                <div className="bg-[var(--color-success)]/10 border border-[var(--color-success)] rounded-2xl p-8">
                  <div className="text-5xl mb-4 text-[var(--color-success)]">{'\u2713'}</div>
                  <h2 className="text-2xl font-bold text-[var(--color-success)] mb-3">
                    {'\u00a1Cuenta creada exitosamente!'}
                  </h2>
                  <p className="text-[var(--color-text-secondary)] mb-6">
                    Tu cuenta ha sido registrada. Ahora puedes iniciar sesión y comenzar a resolver ejercicios de Assembly.
                  </p>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 bg-[var(--color-accent)] text-[var(--color-bg)] px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:opacity-90"
                  >
                    Iniciar Sesión
                  </Link>
                </div>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={onSubmit}>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-primary)]">
                    Correo Electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={`w-full px-4 py-3 bg-[var(--color-surface)] border rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:ring-1 focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)] transition-all duration-200 ${emailError ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'}`}
                    placeholder="tu@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                  {emailError && (
                    <p className="text-[var(--color-error)] text-sm">{emailError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-primary)]">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    className={`w-full px-4 py-3 bg-[var(--color-surface)] border rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:ring-1 focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)] transition-all duration-200 ${passwordErrors.length > 0 ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'}`}
                    placeholder="Mínimo 8 caracteres"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  {passwordErrors.length > 0 && (
                    <div className="bg-[var(--color-error-bg)] border border-[var(--color-error)] rounded-lg p-3 space-y-1">
                      {passwordRules.map((rule, index) => (
                        <p key={index} className={`text-sm ${rule.valid ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}>
                          {rule.valid ? '\u2713' : '\u25CB'} {rule.label}
                        </p>
                      ))}
                    </div>
                  )}
                  {passwordErrors.length === 0 && password && (
                    <div className="rounded-lg p-3 space-y-1 border" style={{ borderColor: 'rgba(61, 255, 160, 0.3)' }}>
                      {passwordRules.map((rule, index) => (
                        <p key={index} className="text-sm text-[var(--color-success)]">
                          {'\u2713'} {rule.label}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--color-text-primary)]">
                    Confirmar Contraseña
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    className={`w-full px-4 py-3 bg-[var(--color-surface)] border rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:ring-1 focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)] transition-all duration-200 ${confirmPasswordError ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'}`}
                    placeholder="Repite tu contraseña"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  {confirmPasswordError && (
                    <p className="text-[var(--color-error)] text-sm">{confirmPasswordError}</p>
                  )}
                  {password && confirmPassword && !confirmPasswordError && (
                    <p className="text-[var(--color-success)] text-sm">{'\u2713'} Las contraseñas coinciden</p>
                  )}
                </div>

                {error && (
                  <div className="bg-[var(--color-error-bg)] border border-[var(--color-error)] rounded-xl p-4">
                    <p className="text-[var(--color-error)] text-sm font-medium">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !isFormValid}
                  className={`w-full py-3 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${isLoading || !isFormValid ? 'bg-[var(--color-accent)]/50 text-[var(--color-bg)]/50 opacity-50 cursor-not-allowed' : 'bg-[var(--color-accent)] text-[var(--color-bg)] hover:opacity-90'}`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-[var(--color-bg)] border-t-transparent rounded-full"></div>
                      Creando cuenta...
                    </>
                  ) : (
                    'Crear Cuenta Gratuita'
                  )}
                </button>
              </form>
            )}

            {!success && (
              <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
                <div className="text-center">
                  <p className="text-[var(--color-text-secondary)]">
                    {'\u00bfYa tienes una cuenta? '}
                    <Link
                      href="/login"
                      className="font-semibold text-[var(--color-accent)] hover:opacity-80 transition-all duration-200"
                    >
                      Inicia sesión aquí
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="text-center mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-200 font-medium"
            >
              <span>{'\u2190'}</span>
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
