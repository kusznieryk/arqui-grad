"use client";
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// Helper function to get score color and styling
function getScoreStyle(score: number) {
  if (score < 20) {
    return {
      bgColor: 'bg-[var(--color-surface)]',
      textColor: 'text-[var(--color-error)]',
      badgeColor: 'bg-[var(--color-error)]',
      icon: null,
      label: 'Necesita Mejoras'
    };
  } else if (score < 50) {
    return {
      bgColor: 'bg-[var(--color-surface)]',
      textColor: 'text-[var(--color-text-primary)]',
      badgeColor: 'bg-[var(--color-error)]',
      icon: null,
      label: 'Regular'
    };
  } else if (score < 70) {
    return {
      bgColor: 'bg-[var(--color-surface)]',
      textColor: 'text-[var(--color-text-primary)]',
      badgeColor: 'bg-[var(--color-accent)]',
      icon: null,
      label: 'Bien'
    };
  } else {
    return {
      bgColor: 'bg-[var(--color-surface)]',
      textColor: 'text-[var(--color-success)]',
      badgeColor: 'bg-[var(--color-success)]',
      icon: null,
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
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-[var(--color-text-primary)]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          Envía tu Solución
        </h2>
        <p className="mt-2 text-[var(--color-text-secondary)]">Escribe tu código Assembly y obtén retroalimentación instantánea</p>
      </div>

      {status === 'loading' && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6 text-center">
          <div className="animate-spin h-8 w-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-[var(--color-text-primary)] font-medium">Verificando sesión...</p>
        </div>
      )}

      {status === 'unauthenticated' && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
          <div className="flex items-center mb-4">
            <svg className="w-8 h-8 mr-3 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <h3 className="text-[var(--color-text-primary)] font-bold text-lg">Inicia Sesión Requerido</h3>
              <p className="text-[var(--color-text-secondary)]">Debes crear una cuenta o iniciar sesión para enviar tu solución y obtener retroalimentación.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link 
              href="/login" 
              className="bg-[var(--color-accent)] text-[var(--color-bg)] px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              Iniciar Sesión
            </Link>
            <Link 
              href="/register" 
              className="bg-[var(--color-accent)] text-[var(--color-bg)] px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              Crear Cuenta
            </Link>
          </div>
        </div>
      )}

      {/* Submit Form - Only show if authenticated */}
      {session && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Tu código Assembly:
            </label>
            <textarea 
              id="code"
              className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all duration-200 font-mono text-sm resize-vertical min-h-[200px]" 
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
            <div className="flex justify-between items-center mt-2 text-sm text-[var(--color-text-tertiary)]">
              <span>Caracteres: {code.length}</span>
              <span>Líneas: {code.split('\n').length}</span>
            </div>
          </div>
          
          <button 
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
              loading || !session
                ? 'bg-[var(--color-accent)]/50 cursor-not-allowed opacity-50' 
                : 'bg-[var(--color-accent)] text-[var(--color-bg)] hover:opacity-90'
            }`}
            type="submit" 
            disabled={loading || !code.trim() || !session}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin h-5 w-5 border-2 border-[var(--color-bg)] border-t-transparent rounded-full"></div>
                Evaluando tu código...
              </span>
            ) : !session ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Inicia Sesión para Enviar
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Enviar Solución
              </span>
            )}
          </button>
        </form>
      </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-[var(--color-error-bg)] border border-[var(--color-error)] rounded-lg p-4">
          <div className="flex items-center">
            <div>
              <h3 className="text-[var(--color-error)] font-semibold">Error</h3>
              <p className="text-[var(--color-error)]">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && scoreStyle && (
        <div className={`${scoreStyle.bgColor} border border-[var(--color-border)] rounded-lg p-6`}>
          {/* Score Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div>
                <h3 className={`text-2xl font-bold ${scoreStyle.textColor}`}>
                  {result.es_correcto ? 'Solución Correcta' : 'Solución Incorrecta'}
                </h3>
                <p className={`${scoreStyle.textColor} opacity-75`}>{scoreStyle.label}</p>
              </div>
            </div>
            <div className={`${scoreStyle.badgeColor} text-[var(--color-bg)] px-6 py-3 rounded-full`}>
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
            <div className="w-full bg-[var(--color-bg)] rounded-full h-4">
              <div 
                className={`h-4 ${scoreStyle.badgeColor} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${result.puntaje}%` }}
              ></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Errors */}
            {result.errores && result.errores.length > 0 && (
              <div className="bg-[var(--color-bg)] rounded-lg p-4 border border-[var(--color-border)]">
                <h4 className="font-bold text-[var(--color-error)] mb-3 flex items-center gap-2">
                  Errores Detectados ({result.errores.length})
                </h4>
                <ul className="space-y-2">
                  {result.errores.map((error: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-[var(--color-text-secondary)] text-sm">
                      <span className="text-[var(--color-error)] mt-1">•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {result.sugerencias && result.sugerencias.length > 0 && (
              <div className="bg-[var(--color-bg)] rounded-lg p-4 border border-[var(--color-border)]">
                <h4 className="font-bold text-[var(--color-accent)] mb-3 flex items-center gap-2">
                  Sugerencias ({result.sugerencias.length})
                </h4>
                <ul className="space-y-2">
                  {result.sugerencias.map((suggestion: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-[var(--color-text-secondary)] text-sm">
                      <span className="text-[var(--color-accent)] mt-1">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Observations */}
          {result.observaciones && (
            <div className="mt-6 bg-[var(--color-bg)] rounded-lg p-4 border border-[var(--color-border)]">
              <h4 className="font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                Observaciones del Evaluador
              </h4>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">{result.observaciones}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <button 
              onClick={() => {setResult(null); setCode('');}} 
              className="px-4 py-2 bg-[var(--color-surface)] hover:opacity-90 text-[var(--color-text-primary)] rounded-lg font-medium transition-all border border-[var(--color-border)]"
            >
              Intentar de Nuevo
            </button>
            {result.puntaje >= 70 && (
              <button className="px-4 py-2 bg-[var(--color-accent)] hover:opacity-90 text-[var(--color-bg)] rounded-lg font-medium transition-all">
                ¡Bien Hecho!
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


