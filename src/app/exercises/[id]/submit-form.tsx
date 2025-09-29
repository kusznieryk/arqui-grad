"use client";
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// Helper function to get score color and styling
function getScoreStyle(score: number) {
  if (score < 20) {
    return {
      bgColor: 'bg-red-100 border-red-300',
      textColor: 'text-red-800',
      badgeColor: 'bg-red-500',
      icon: '❌',
      label: 'Necesita Mejoras'
    };
  } else if (score < 50) {
    return {
      bgColor: 'bg-orange-100 border-orange-300',
      textColor: 'text-orange-800',
      badgeColor: 'bg-orange-500',
      icon: '⚠️',
      label: 'Regular'
    };
  } else if (score < 70) {
    return {
      bgColor: 'bg-yellow-100 border-yellow-300',
      textColor: 'text-yellow-800',
      badgeColor: 'bg-yellow-500',
      icon: '⚡',
      label: 'Bien'
    };
  } else {
    return {
      bgColor: 'bg-green-100 border-green-300',
      textColor: 'text-green-800',
      badgeColor: 'bg-green-500',
      icon: '✅',
      label: 'Excelente'
    };
  }
}

export default function SubmitForm({ exerciseId }: { exerciseId: string }) {
  const { data: session, status } = useSession();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Check if user is logged in
    if (!session) {
      setError('Debes iniciar sesión para enviar tu solución');
      return;
    }
    
    if (!code.trim()) {
      setError('Por favor, ingresa tu código ASM antes de enviar');
      return;
    }
    
    setLoading(true); 
    setError(null); 
    setResult(null);
    
    try {
      const res = await fetch('/api/submissions', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ exerciseId, code }) 
      });
      
      if (!res.ok) { 
        setError('No se pudo enviar la solución. Intenta nuevamente.'); 
        return; 
      }
      
      const json = await res.json();
      setResult(json.submission?.resultJson);
    } catch (err) {
      setError('Error de conexión. Verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  }

  const scoreStyle = result ? getScoreStyle(result.puntaje) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span>💻</span> Envía tu Solución
        </h2>
        <p className="mt-2 opacity-90">Escribe tu código Assembly y obtén retroalimentación instantánea</p>
      </div>

      {/* Login Required Message */}
      {status === 'loading' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-blue-700 font-medium">Verificando sesión...</p>
        </div>
      )}

      {status === 'unauthenticated' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3">🔐</span>
            <div>
              <h3 className="text-yellow-800 font-bold text-lg">Inicia Sesión Requerido</h3>
              <p className="text-yellow-700">Debes crear una cuenta o iniciar sesión para enviar tu solución y obtener retroalimentación.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link 
              href="/login" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <span>🚀</span>
              Iniciar Sesión
            </Link>
            <Link 
              href="/register" 
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <span>✨</span>
              Crear Cuenta
            </Link>
          </div>
        </div>
      )}

      {/* Submit Form - Only show if authenticated */}
      {session && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-2">
              📝 Tu código Assembly:
            </label>
            <textarea 
              id="code"
              className="w-full border-2 border-gray-300 rounded-lg p-4 font-mono text-sm bg-white text-gray-900 placeholder-gray-500
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all
                         hover:border-gray-400 resize-vertical min-h-[200px]" 
              rows={12} 
              placeholder="Escribe o pega tu código ASM aquí...

Ejemplo:
ORG 2000H
MOV AL, 5
MOV BL, 3
ADD AL, BL
INT 0" 
              value={code} 
              onChange={e => setCode(e.target.value)}
              disabled={!session}
            />
            <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
              <span>Caracteres: {code.length}</span>
              <span>Líneas: {code.split('\n').length}</span>
            </div>
          </div>
          
          <button 
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all transform hover:scale-[1.02] ${
              loading || !session
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 shadow-lg hover:shadow-xl'
            }`}
            type="submit" 
            disabled={loading || !code.trim() || !session}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                Evaluando tu código...
              </span>
            ) : !session ? (
              <span className="flex items-center justify-center gap-2">
                <span>🔐</span> Inicia Sesión para Enviar
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>🚀</span> Enviar Solución
              </span>
            )}
          </button>
        </form>
      </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <span className="text-2xl mr-2">⚠️</span>
            <div>
              <h3 className="text-red-800 font-semibold">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && scoreStyle && (
        <div className={`${scoreStyle.bgColor} border-2 ${scoreStyle.bgColor.replace('bg-', 'border-')} rounded-lg p-6 shadow-lg`}>
          {/* Score Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{scoreStyle.icon}</span>
              <div>
                <h3 className={`text-2xl font-bold ${scoreStyle.textColor}`}>
                  {result.es_correcto ? 'Solución Correcta' : 'Solución Incorrecta'}
                </h3>
                <p className={`${scoreStyle.textColor} opacity-75`}>{scoreStyle.label}</p>
              </div>
            </div>
            <div className={`${scoreStyle.badgeColor} text-white px-6 py-3 rounded-full shadow-lg`}>
              <span className="text-2xl font-bold">{result.puntaje}</span>
              <span className="text-sm opacity-75">/100</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span className={scoreStyle.textColor}>Progreso</span>
              <span className={scoreStyle.textColor}>{result.puntaje}%</span>
            </div>
            <div className="w-full bg-white bg-opacity-50 rounded-full h-4 shadow-inner">
              <div 
                className={`h-4 ${scoreStyle.badgeColor} rounded-full transition-all duration-1000 ease-out shadow-sm`}
                style={{ width: `${result.puntaje}%` }}
              ></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Errors */}
            {result.errores && result.errores.length > 0 && (
              <div className="bg-white bg-opacity-60 rounded-lg p-4 border border-red-200">
                <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                  <span>🔍</span> Errores Detectados ({result.errores.length})
                </h4>
                <ul className="space-y-2">
                  {result.errores.map((error: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-red-700 text-sm">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {result.sugerencias && result.sugerencias.length > 0 && (
              <div className="bg-white bg-opacity-60 rounded-lg p-4 border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                  <span>💡</span> Sugerencias ({result.sugerencias.length})
                </h4>
                <ul className="space-y-2">
                  {result.sugerencias.map((suggestion: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-blue-700 text-sm">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Observations */}
          {result.observaciones && (
            <div className="mt-6 bg-white bg-opacity-60 rounded-lg p-4 border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>📋</span> Observaciones del Evaluador
              </h4>
              <p className="text-gray-700 leading-relaxed">{result.observaciones}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <button 
              onClick={() => {setResult(null); setCode('');}} 
              className="px-4 py-2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 rounded-lg font-medium transition-all border border-gray-300 hover:border-gray-400"
            >
              🔄 Intentar de Nuevo
            </button>
            {result.puntaje >= 70 && (
              <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all">
                🎉 ¡Bien Hecho!
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


