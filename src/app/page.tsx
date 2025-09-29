'use client';
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Small delay to ensure hydration is complete
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-pink-400/10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className={`text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} suppressHydrationWarning>
            
            {/* Main Title */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-7xl animate-bounce">💻</span>
                <div className="text-left">
                  <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Arqui ASM
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-600 font-medium">
                    Assembly Learning Platform
                  </p>
                </div>
              </div>
              
              <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                🚀 <span className="font-semibold">Plataforma inteligente</span> para aprender Assembly con 
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold"> IA de última generación</span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} suppressHydrationWarning>
              {status === 'loading' ? (
                <div className="flex items-center gap-2 px-8 py-4 bg-white rounded-xl shadow-lg">
                  <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  <span className="text-gray-600">Cargando...</span>
                </div>
              ) : session ? (
                <Link 
                  href="/exercises" 
                  className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  <span className="flex items-center gap-3">
                    <span className="group-hover:animate-pulse">🎯</span>
                    ¡Continuar Aprendiendo!
                  </span>
                </Link>
              ) : (
                <>
                  <Link 
                    href="/register" 
                    className="group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                  >
                    <span className="flex items-center gap-3">
                      <span className="group-hover:animate-bounce">✨</span>
                      Comenzar Gratis
                    </span>
                  </Link>
                  <Link 
                    href="/exercises" 
                    className="group bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 hover:border-purple-300 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                  >
                    <span className="flex items-center gap-3">
                      <span className="group-hover:animate-pulse">👀</span>
                      Ver Ejercicios
                    </span>
                  </Link>
                </>
              )}
            </div>

            {/* Stats Section */}
            {session && (
              <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} suppressHydrationWarning>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-3xl mb-2">🏆</div>
                  <div className="text-2xl font-bold text-gray-800">¡Bienvenido!</div>
                  <div className="text-gray-600">{session.user?.email?.split('@')[0]}</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-3xl mb-2">📚</div>
                  <div className="text-2xl font-bold text-gray-800">Ejercicios</div>
                  <div className="text-gray-600">Disponibles para resolver</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-3xl mb-2">🤖</div>
                  <div className="text-2xl font-bold text-gray-800">IA Avanzada</div>
                  <div className="text-gray-600">Evaluación inteligente</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} suppressHydrationWarning>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              ¿Por qué elegir <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Arqui ASM</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Una experiencia de aprendizaje revolucionaria con tecnología de inteligencia artificial
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Ejercicios Interactivos",
                description: "Resuelve problemas de Assembly diseñados específicamente para estudiantes de Arquitectura de Computadores.",
                gradient: "from-blue-500 to-cyan-500",
                delay: "delay-1000"
              },
              {
                icon: "🤖",
                title: "Evaluación con IA",
                description: "Recibe retroalimentación instantánea y detallada de tus soluciones usando Gemini 2.5 Flash-Lite.",
                gradient: "from-purple-500 to-pink-500",
                delay: "delay-1200"
              },
              {
                icon: "📊",
                title: "Seguimiento de Progreso",
                description: "Monitorea tu evolución con puntajes detallados, identificación de errores y sugerencias personalizadas.",
                gradient: "from-green-500 to-emerald-500",
                delay: "delay-1400"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${isLoaded ? `opacity-100 translate-y-0 ${feature.delay}` : 'opacity-0 translate-y-8'}`}
                suppressHydrationWarning
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 delay-1600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} suppressHydrationWarning>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              🚀 Tecnología de Vanguardia
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Potenciado por las mejores herramientas y tecnologías modernas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Next.js 15", icon: "⚡", color: "from-black to-gray-700" },
              { name: "Google AI", icon: "🧠", color: "from-blue-500 to-purple-600" },
              { name: "TypeScript", icon: "🔷", color: "from-blue-600 to-blue-800" },
              { name: "Tailwind CSS", icon: "🎨", color: "from-cyan-500 to-blue-500" }
            ].map((tech, index) => (
              <div 
                key={index}
                className={`bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${isLoaded ? `opacity-100 translate-y-0 delay-${1800 + index * 100}` : 'opacity-0 translate-y-8'}`}
                suppressHydrationWarning
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${tech.color} rounded-xl flex items-center justify-center text-white text-xl mx-auto mb-3`}>
                  {tech.icon}
                </div>
                <h4 className="font-semibold text-gray-800">{tech.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!session && (
        <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className={`transition-all duration-1000 delay-2200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} suppressHydrationWarning>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                🎓 ¿Listo para dominar Assembly?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Únete a miles de estudiantes que ya están mejorando sus habilidades en programación Assembly
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/register" 
                  className="group bg-white hover:bg-gray-100 text-purple-600 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  <span className="flex items-center gap-3">
                    <span className="group-hover:animate-bounce">🚀</span>
                    Crear Cuenta Gratuita
                  </span>
                </Link>
                <Link 
                  href="/login" 
                  className="group bg-transparent hover:bg-white/10 text-white border-2 border-white/30 hover:border-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center gap-3">
                    <span className="group-hover:animate-pulse">🔑</span>
                    Ya tengo cuenta
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Add custom CSS for animations */}
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
      `}</style>
    </div>
  );
}