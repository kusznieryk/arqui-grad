'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = () => {
    signOut();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 bg-[var(--color-bg)] border-b border-[var(--color-border)] ${
      isScrolled ? 'shadow-lg' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-8 sm:px-10 lg:px-12">
        <div className="flex justify-between items-center h-[52px]">
          
          <Link href="/" className="flex items-center gap-2">
            <div className="w-[26px] h-[26px] border-[1.5px] border-[var(--color-accent)] rounded-[4px] flex items-center justify-center font-mono text-[11px] text-[var(--color-accent)] tracking-[-0.5px]">
              ASM
            </div>
            <span className="text-[14px] font-medium text-white">
              Arqui ASM
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/exercises" 
              className="text-[13px] text-[var(--color-text-secondary)] hover:text-white transition-colors"
            >
              Ejercicios
            </Link>
            
            {(session?.user as any)?.isAdmin && (
              <Link 
                href="/admin" 
                className="text-[13px] text-[var(--color-text-secondary)] hover:text-white transition-colors"
              >
                Admin
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {status === 'loading' ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-[var(--color-accent)] border-t-transparent rounded-full"></div>
                <span className="text-[13px] text-[var(--color-text-secondary)]">
                  Cargando...
                </span>
              </div>
            ) : session ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2">
                  <div className="w-8 h-8 bg-[var(--color-accent)] rounded-full flex items-center justify-center text-[var(--color-bg)] font-bold text-[13px]">
                    {session.user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-white">
                      {session.user?.email?.split('@')[0]}
                    </p>
                    <p className="text-[11px] text-[var(--color-text-secondary)]">
                      {(session.user as any)?.isAdmin ? 'Administrador' : 'Estudiante'}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={handleSignOut}
                  className="text-[13px] px-4 py-2 border border-[var(--color-error)] text-[var(--color-error)] bg-transparent rounded-[4px] hover:bg-[var(--color-error-bg)] transition-colors"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  href="/login" 
                  className="text-[13px] px-4 py-2 border border-[var(--color-accent)] text-[var(--color-accent)] bg-transparent rounded-[4px] hover:bg-[rgba(61,255,160,0.08)] transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link 
                  href="/register" 
                  className="text-[13px] px-4 py-2 bg-[var(--color-accent)] text-[var(--color-bg)] rounded-[4px] hover:opacity-88 transition-opacity font-medium"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[var(--color-text-secondary)] hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-[52px] left-0 right-0 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
            <div className="px-4 py-6 space-y-4">
              
              <Link 
                href="/exercises" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 text-[13px] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] rounded-lg transition-colors"
              >
                Ejercicios
              </Link>
              
              {(session?.user as any)?.isAdmin && (
                <Link 
                  href="/admin" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 text-[13px] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] rounded-lg transition-colors"
                >
                  Admin
                </Link>
              )}

              <div className="border-t border-[var(--color-border)] pt-4 mt-4">
                {status === 'loading' ? (
                  <div className="flex items-center justify-center gap-2 p-3">
                    <div className="animate-spin h-5 w-5 border-2 border-[var(--color-accent)] border-t-transparent rounded-full"></div>
                    <span className="text-[var(--color-text-secondary)]">Cargando...</span>
                  </div>
                ) : session ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-[var(--color-surface)] rounded-lg">
                      <div className="w-10 h-10 bg-[var(--color-accent)] rounded-full flex items-center justify-center text-[var(--color-bg)] font-bold text-[14px]">
                        {session.user?.email?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium text-[13px]">{session.user?.email?.split('@')[0]}</p>
                        <p className="text-[var(--color-text-secondary)] text-[11px]">
                          {(session.user as any)?.isAdmin ? 'Administrador' : 'Estudiante'}
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-center gap-2 border border-[var(--color-error)] text-[var(--color-error)] bg-transparent p-3 rounded-lg text-[13px] hover:bg-[var(--color-error-bg)] transition-colors"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link 
                      href="/login" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 border border-[var(--color-accent)] text-[var(--color-accent)] bg-transparent p-3 rounded-lg text-[13px] hover:bg-[rgba(61,255,160,0.08)] transition-colors"
                    >
                      Iniciar sesión
                    </Link>
                    <Link 
                      href="/register" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 bg-[var(--color-accent)] text-[var(--color-bg)] p-3 rounded-lg text-[13px] font-medium hover:opacity-88 transition-opacity"
                    >
                      Registrarse
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
