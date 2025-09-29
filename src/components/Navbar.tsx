'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
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
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                💻
              </span>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
            </div>
            <div>
              <h1 className={`text-xl font-bold transition-colors duration-300 ${
                isScrolled ? 'text-gray-800' : 'text-white'
              }`}>
                Arqui ASM
              </h1>
              <p className={`text-xs transition-colors duration-300 ${
                isScrolled ? 'text-gray-500' : 'text-white/75'
              }`}>
                Assembly Learning
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              href="/exercises" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-700' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <span className="mr-2">📚</span>
              Ejercicios
            </Link>
            
            {(session?.user as any)?.isAdmin && (
              <Link 
                href="/admin" 
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                  isScrolled 
                    ? 'text-gray-700 hover:bg-purple-50 hover:text-purple-700' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <span className="mr-2">⚙️</span>
                Admin
              </Link>
            )}
          </div>

          {/* User Authentication Section */}
          <div className="hidden md:flex items-center space-x-3">
            {status === 'loading' ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span className={`text-sm ${isScrolled ? 'text-gray-600' : 'text-white/75'}`}>
                  Cargando...
                </span>
              </div>
            ) : session ? (
              <div className="flex items-center space-x-3">
                {/* User Info */}
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  isScrolled ? 'bg-gray-100' : 'bg-white/20'
                }`}>
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {session.user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${
                      isScrolled ? 'text-gray-800' : 'text-white'
                    }`}>
                      {session.user?.email?.split('@')[0]}
                    </p>
                    <p className={`text-xs ${
                      isScrolled ? 'text-gray-500' : 'text-white/75'
                    }`}>
                      {(session.user as any)?.isAdmin ? 'Administrador' : 'Estudiante'}
                    </p>
                  </div>
                </div>
                
                {/* Sign Out Button */}
                <button 
                  onClick={handleSignOut}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  <span className="mr-2">🚪</span>
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  href="/login" 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  <span className="mr-2">🔑</span>
                  Iniciar sesión
                </Link>
                <Link 
                  href="/register" 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  <span className="mr-2">✨</span>
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors duration-200 ${
              isScrolled 
                ? 'text-gray-700 hover:bg-gray-100' 
                : 'text-white hover:bg-white/20'
            }`}
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t border-gray-200 animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-6 space-y-4">
              
              {/* Mobile Navigation Links */}
              <Link 
                href="/exercises" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
              >
                <span className="text-xl">📚</span>
                <span className="font-medium">Ejercicios</span>
              </Link>
              
              {(session?.user as any)?.isAdmin && (
                <Link 
                  href="/admin" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200"
                >
                  <span className="text-xl">⚙️</span>
                  <span className="font-medium">Admin</span>
                </Link>
              )}

              {/* Mobile User Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                {status === 'loading' ? (
                  <div className="flex items-center justify-center gap-2 p-3">
                    <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    <span className="text-gray-600">Cargando...</span>
                  </div>
                ) : session ? (
                  <div className="space-y-3">
                    {/* Mobile User Info */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {session.user?.email?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-gray-800 font-medium">{session.user?.email?.split('@')[0]}</p>
                        <p className="text-gray-500 text-sm">
                          {(session.user as any)?.isAdmin ? 'Administrador' : 'Estudiante'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Mobile Sign Out Button */}
                    <button 
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white p-3 rounded-lg font-medium transition-all duration-200"
                    >
                      <span>🚪</span>
                      Cerrar sesión
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link 
                      href="/login" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white p-3 rounded-lg font-medium transition-all duration-200"
                    >
                      <span>🔑</span>
                      Iniciar sesión
                    </Link>
                    <Link 
                      href="/register" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-3 rounded-lg font-medium transition-all duration-200"
                    >
                      <span>✨</span>
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
