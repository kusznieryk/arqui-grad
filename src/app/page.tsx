'use client';
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Arqui ASM
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Plataforma para evaluar soluciones de Assembly usando inteligencia artificial
          </p>
          <div className="space-x-4">
            <Link 
              href="/exercises" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-block"
            >
              Ver Ejercicios
            </Link>
            <Link 
              href="/login" 
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium inline-block"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">📝 Ejercicios</h3>
            <p className="text-gray-600">
              Resuelve problemas de Assembly con ejercicios diseñados para estudiantes de Arquitectura de Computadores.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">🤖 Evaluación IA</h3>
            <p className="text-gray-600">
              Recibe retroalimentación instantánea y detallada de tus soluciones usando Gemini 2.5 Flash-Lite.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">📊 Seguimiento</h3>
            <p className="text-gray-600">
              Monitorea tu progreso con puntajes, errores identificados y sugerencias de mejora.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}