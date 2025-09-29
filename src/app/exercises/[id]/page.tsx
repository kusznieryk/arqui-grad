import { prisma } from '@/lib/prisma';
import SubmitForm from './submit-form';

// Helper function to safely get a string array from JsonValue
function getStringArrayFromJson(value: any): string[] {
  if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
    return value;
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
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      badgeColor: 'bg-red-500',
      icon: '❌'
    };
  } else if (score < 50) {
    return {
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800',
      badgeColor: 'bg-orange-500',
      icon: '⚠️'
    };
  } else if (score < 70) {
    return {
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      badgeColor: 'bg-yellow-500',
      icon: '⚡'
    };
  } else {
    return {
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      badgeColor: 'bg-green-500',
      icon: '✅'
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-md">
          <span className="text-6xl mb-4 block">😕</span>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Ejercicio No Encontrado</h1>
          <p className="text-gray-600 mb-4">El ejercicio que buscas no existe o ha sido eliminado.</p>
          <a href="/exercises" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-all">
            Volver a Ejercicios
          </a>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto p-4 space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">📚</span>
              <div>
                <h1 className="text-3xl font-bold">{ex.title}</h1>
                <p className="opacity-90">Ejercicio de Arquitectura de Computadores</p>
              </div>
            </div>
            
            {/* Tags */}
            {(() => {
              const tags = getStringArrayFromJson(ex.tags);
              return tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {tags.map((tag: string, index: number) => (
                    <span 
                      key={index}
                      className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm"
                    >
                      🏷️ {tag}
                    </span>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Exercise Description */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📋</span>
            <h2 className="text-xl font-bold text-gray-800">Descripción del Ejercicio</h2>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-blue-500">
            <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-700 overflow-x-auto">
{ex.prompt}
            </pre>
          </div>

          {/* Instructions Panel */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">💡</span>
              <h3 className="font-semibold text-blue-800">Instrucciones</h3>
            </div>
            <ul className="text-sm text-blue-700 space-y-1 ml-6">
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
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">📊</span>
              <h2 className="text-xl font-bold text-gray-800">Historial de Envíos</h2>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                {subs.length} envío{subs.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid gap-4">
              {subs.map((sub, index) => {
                const scoreStyle = getScoreStyle(sub.score);
                return (
                  <div 
                    key={sub.id}
                    className={`${scoreStyle.bgColor} border border-gray-200 rounded-lg p-4 transition-all hover:shadow-md`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{scoreStyle.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-700">Envío #{subs.length - index}</span>
                            <span className={`${scoreStyle.badgeColor} text-white px-2 py-1 rounded-full text-xs font-bold`}>
                              {sub.score}/100
                            </span>
                            {sub.isCorrect && (
                              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                ✓ Correcto
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            📅 {formatDate(sub.createdAt.toString())}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${scoreStyle.textColor}`}>
                          {sub.score}%
                        </div>
                        <div className="w-20 bg-white bg-opacity-50 rounded-full h-2 mt-1">
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
                        <div className="mt-3 pt-3 border-t border-white border-opacity-50">
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            {hasErrors && (
                              <div>
                                <span className="font-medium text-red-700">
                                  🔍 {errores.length} error{errores.length !== 1 ? 'es' : ''}
                                </span>
                              </div>
                            )}
                            {hasSuggestions && (
                              <div>
                                <span className="font-medium text-blue-700">
                                  💡 {sugerencias.length} sugerencia{sugerencias.length !== 1 ? 's' : ''}
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
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">{subs.length}</div>
                  <div className="text-sm text-blue-700">Total Envíos</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {subs.filter(s => s.isCorrect).length}
                  </div>
                  <div className="text-sm text-green-700">Correctos</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(subs.reduce((acc, s) => acc + s.score, 0) / subs.length) || 0}
                  </div>
                  <div className="text-sm text-purple-700">Promedio</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🎯</span>
            <h2 className="text-xl font-bold text-green-800">Consejos para el Éxito</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-green-700 mb-2">✨ Mejores Prácticas</h3>
              <ul className="text-sm text-green-600 space-y-1">
                <li>• Planifica tu solución antes de codificar</li>
                <li>• Usa nombres descriptivos para las etiquetas</li>
                <li>• Añade comentarios explicativos</li>
                <li>• Revisa la sintaxis Assembly x86</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-green-700 mb-2">🔧 Depuración</h3>
              <ul className="text-sm text-green-600 space-y-1">
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


