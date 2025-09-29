"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Small delay to ensure hydration is complete
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    // Validation
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden. Verifica e inténtalo de nuevo.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
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
        // Clear form
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-md w-full">
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} suppressHydrationWarning>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-4xl animate-bounce">✨</span>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Crear Cuenta
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              Únete a <span className="font-semibold">Arqui ASM</span> y comienza a aprender
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
            {success ? (
              <div className="text-center space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-2xl font-bold text-green-800 mb-3">
                    ¡Cuenta creada exitosamente!
                  </h2>
                  <p className="text-green-700 mb-6">
                    Tu cuenta ha sido registrada. Ahora puedes iniciar sesión y comenzar a resolver ejercicios de Assembly.
                  </p>
                  <Link 
                    href="/login"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                  >
                    <span>🚀</span>
                    Iniciar Sesión
                  </Link>
                </div>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={onSubmit}>
                {/* Email Input */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    📧 Correo Electrónico
                  </label>
                  <input 
                    id="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 hover:bg-gray-50" 
                    placeholder="tu@email.com" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    🔒 Contraseña
                  </label>
                  <input 
                    id="password"
                    type="password" 
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 hover:bg-gray-50" 
                    placeholder="Mínimo 6 caracteres" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    🔐 Confirmar Contraseña
                  </label>
                  <input 
                    id="confirmPassword"
                    type="password" 
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 hover:bg-gray-50" 
                    placeholder="Repite tu contraseña" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 animate-shake">
                    <span className="text-red-500 text-xl">⚠️</span>
                    <div className="text-red-700 text-sm font-medium">{error}</div>
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={isLoading || !email || !password || !confirmPassword}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:scale-100 disabled:shadow-none flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Creando cuenta...
                    </>
                  ) : (
                    <>
                      <span>🌟</span>
                      Crear Cuenta Gratuita
                    </>
                  )}
                </button>
              </form>
            )}

            {!success && (
              <>
                {/* Divider */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-gray-600">
                      ¿Ya tienes una cuenta?{' '}
                      <Link 
                        href="/login" 
                        className="font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
                      >
                        Inicia sesión aquí 🚀
                      </Link>
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors duration-200 font-medium"
            >
              <span>←</span>
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
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


