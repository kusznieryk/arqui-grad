import { prisma } from '@/lib/prisma';
import SubmitForm from './submit-form';
import Link from 'next/link';

// Helper function to safely get a string array from JsonValue
function getStringArrayFromJson(value: any): string[] {
  console.log('Tags raw value:', value, 'Type:', typeof value);
  
  if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
    return value;
  }
  
  // Try to parse if it's a JSON string
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
        return parsed;
      }
    } catch (e) {
      console.log('Failed to parse JSON string:', e);
    }
  }
  
  return [];
}

// Helper function to safely get a property from JSON object
function getJsonProperty(obj: any, key: string): any {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    return obj[key];
  }
  return undefined;
}

// Helper function to get score color and styling for submissions
function getScoreStyle(score: number) {
  if (score < 20) {
    return {
      bgColor: 'bg-[var(--color-error-bg)]',
      textColor: 'text-[var(--color-error)]',
      badgeColor: 'bg-[var(--color-error)]'
    };
  } else if (score < 50) {
    return {
      bgColor: 'bg-[var(--color-surface)]',
      textColor: 'text-[var(--color-text-primary)]',
      badgeColor: 'bg-[var(--color-error)]'
    };
  } else if (score < 70) {
    return {
      bgColor: 'bg-[var(--color-surface)]',
      textColor: 'text-[var(--color-text-primary)]',
      badgeColor: 'bg-[var(--color-accent)]'
    };
  } else {
    return {
      bgColor: 'bg-[var(--color-surface)]',
      textColor: 'text-[var(--color-success)]',
      badgeColor: 'bg-[var(--color-success)]'
    };
  }
}

// Helper function to format date
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default async function ExerciseDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ex = await prisma.exercise.findUnique({ 
    where: { id }, 
    select: { id: true, title: true, prompt: true, tags: true } 
  });
  
  if (!ex) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-6">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-8 text-center max-w-md">
          <svg viewBox="0 0 24 24" className="w-16 h-16 stroke-[var(--color-error)] fill-none stroke-2 mx-auto mb-4">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Ejercicio No Encontrado</h1>
          <p className="text-[var(--color-text-secondary)] mb-4">El ejercicio que buscas no existe o ha sido eliminado.</p>
          <Link href="/exercises" className="inline-block bg-[var(--color-accent)] hover:opacity-90 text-[var(--color-bg)] px-6 py-2 rounded-lg font-medium transition-all">
            Volver a Ejercicios
          </Link>
        </div>
      </div>
    );
  }

  const subs = await prisma.submission.findMany({ 
    where: { exerciseId: id }, 
    orderBy: { createdAt: 'desc' }, 
    take: 10, 
    select: { id: true, createdAt: true, score: true, isCorrect: true, resultJson: true } 
  });

  // Process tags once at the component level
  const tags = getStringArrayFromJson(ex.tags);
  console.log('Processed tags:', tags);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-6xl mx-auto p-4 space-y-8">
        
        {/* Header Section */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden">
          <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 flex items-center justify-center bg-[var(--color-accent)] rounded-lg">
                <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[var(--color-bg)] fill-none stroke-2">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">{ex.title}</h1>
                <p className="text-[var(--color-text-secondary)]">Ejercicio de Arquitectura de Computadores</p>
              </div>
            </div>
            
            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {tags.map((tag: string, index: number) => (
                  <span 
                    key={index}
                    className="bg-[var(--color-bg)] bg-opacity-50 px-3 py-1 rounded-full text-sm font-medium border border-[var(--color-border)] text-[var(--color-text-secondary)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Exercise Description */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[var(--color-text-primary)] fill-none stroke-2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
            </svg>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Descripción del Ejercicio</h2>
          </div>
          
          <div className="bg-[var(--color-bg)] rounded-lg p-6 border-l-4 border-[var(--color-accent)]">
            <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-[var(--color-text-secondary)] overflow-x-auto">
{ex.prompt}
            </pre>
          </div>

          {/* Instructions Panel */}
          <div className="mt-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[var(--color-accent)] fill-none stroke-2">
                <path d="M9 18h6M10 22h4M12 2v1M12 8v6M12 18v2M4.93 4.93l.7.7M18.36 4.93l-.7.7M4.93 19.07l.7-.7M18.36 19.07l-.7-.7M2 12h1M21 12h1" />
              </svg>
              <h3 className="font-semibold text-[var(--color-text-primary)]">Instrucciones</h3>
            </div>
            <ul className="text-sm text-[var(--color-text-secondary)] space-y-1 ml-6">
              <li>• Lee cuidadosamente el enunciado del problema</li>
              <li>• Escribe tu solución en Assembly x86</li>
              <li>• Usa comentarios para explicar tu código</li>
              <li>• Verifica la sintaxis antes de enviar</li>
            </ul>
          </div>
        </div>

        {/* Submit Form Section */}
        <SubmitForm exerciseId={ex.id} />

        {/* Submissions History */}
        {subs.length > 0 && (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[var(--color-text-primary)] fill-none stroke-2">
                <path d="M18 20V10M12 20V4M6 20v-6" />
              </svg>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Historial de Envíos</h2>
              <span className="bg-[var(--color-bg)] text-[var(--color-text-secondary)] px-3 py-1 rounded-full text-sm font-medium border border-[var(--color-border)]">
                {subs.length} envío{subs.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid gap-4">
              {subs.map((sub, index) => {
                const scoreStyle = getScoreStyle(sub.score);
                return (
                  <div 
                    key={sub.id}
                    className={`${scoreStyle.bgColor} border border-[var(--color-border)] rounded-lg p-4 transition-all hover:border-[var(--color-accent)]`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[var(--color-text-primary)]">Envío #{subs.length - index}</span>
                            <span className={`${scoreStyle.badgeColor} text-[var(--color-bg)] px-2 py-1 rounded-full text-xs font-bold`}>
                              {sub.score}/100
                            </span>
                            {sub.isCorrect && (
                              <span className="bg-[var(--color-success)] text-[var(--color-bg)] px-2 py-1 rounded-full text-xs font-bold">
                                ✓ Correcto
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[var(--color-text-secondary)]">
                            {formatDate(sub.createdAt.toString())}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${scoreStyle.textColor}`}>
                          {sub.score}%
                        </div>
                        <div className="w-20 bg-[var(--color-bg)] rounded-full h-2 mt-1 border border-[var(--color-border)]">
                          <div 
                            className={`h-2 ${scoreStyle.badgeColor} rounded-full transition-all`}
                            style={{ width: `${sub.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Results Summary */}
                    {(() => {
                      const errores = getJsonProperty(sub.resultJson, 'errores');
                      const sugerencias = getJsonProperty(sub.resultJson, 'sugerencias');
                      const hasErrors = Array.isArray(errores) && errores.length > 0;
                      const hasSuggestions = Array.isArray(sugerencias) && sugerencias.length > 0;
                      
                      return (hasErrors || hasSuggestions) && (
                        <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            {hasErrors && (
                              <div>
                                <span className="font-medium text-[var(--color-error)]">
                                  {errores.length} error{errores.length !== 1 ? 'es' : ''}
                                </span>
                              </div>
                            )}
                            {hasSuggestions && (
                              <div>
                                <span className="font-medium text-[var(--color-accent)]">
                                  {sugerencias.length} sugerencia{sugerencias.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                );
              })}
            </div>

            {/* Statistics */}
            <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="bg-[var(--color-bg)] rounded-lg p-4 border border-[var(--color-border)]">
                  <div className="text-2xl font-bold text-[var(--color-accent)]">{subs.length}</div>
                  <div className="text-sm text-[var(--color-text-secondary)]">Total Envíos</div>
                </div>
                <div className="bg-[var(--color-bg)] rounded-lg p-4 border border-[var(--color-border)]">
                  <div className="text-2xl font-bold text-[var(--color-success)]">
                    {subs.filter(s => s.isCorrect).length}
                  </div>
                  <div className="text-sm text-[var(--color-text-secondary)]">Correctos</div>
                </div>
                <div className="bg-[var(--color-bg)] rounded-lg p-4 border border-[var(--color-border)]">
                  <div className="text-2xl font-bold text-[var(--color-accent)]">
                    {Math.round(subs.reduce((acc, s) => acc + s.score, 0) / subs.length) || 0}
                  </div>
                  <div className="text-sm text-[var(--color-text-secondary)]">Promedio</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[var(--color-accent)] fill-none stroke-2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Consejos para el Éxito</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">Mejores Prácticas</h3>
              <ul className="text-sm text-[var(--color-text-secondary)] space-y-1">
                <li>• Planifica tu solución antes de codificar</li>
                <li>• Usa nombres descriptivos para las etiquetas</li>
                <li>• Añade comentarios explicativos</li>
                <li>• Revisa la sintaxis Assembly x86</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">Depuración</h3>
              <ul className="text-sm text-[var(--color-text-secondary)] space-y-1">
                <li>• Verifica los registros utilizados</li>
                <li>• Comprueba las direcciones de memoria</li>
                <li>• Revisa las instrucciones de salto</li>
                <li>• Asegúrate de incluir INT 0 al final</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


