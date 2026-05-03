'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';

interface Exercise {
  id: string;
  practica: number;
  title: string;
  tags: string[];
}

// Helper function to get unique tags from all exercises
function getAllTags(exercises: Exercise[]): string[] {
  const tagSet = new Set<string>();
  exercises.forEach(exercise => {
    if (Array.isArray(exercise.tags)) {
      exercise.tags.forEach(tag => tagSet.add(tag));
    }
  });
  return Array.from(tagSet).sort();
}

// Helper function to get practice color scheme
function getPracticaStyle(practicaNumber: number) {
  const styles = {
    1: {
      bg: 'bg-[var(--color-surface)]',
      border: 'border-[var(--color-border)]',
      text: 'text-[var(--color-text-primary)]',
      accent: 'bg-[var(--color-accent)]',
      badge: 'P1'
    },
    2: {
      bg: 'bg-[var(--color-surface)]',
      border: 'border-[var(--color-border)]',
      text: 'text-[var(--color-text-primary)]',
      accent: 'bg-[var(--color-accent)]',
      badge: 'P2'
    },
    3: {
      bg: 'bg-[var(--color-surface)]',
      border: 'border-[var(--color-border)]',
      text: 'text-[var(--color-text-primary)]',
      accent: 'bg-[var(--color-accent)]',
      badge: 'P3'
    },
    default: {
      bg: 'bg-[var(--color-surface)]',
      border: 'border-[var(--color-border)]',
      text: 'text-[var(--color-text-primary)]',
      accent: 'bg-[var(--color-accent)]',
      badge: `P${practicaNumber}`
    }
  };
  return styles[practicaNumber as keyof typeof styles] || styles.default;
}

export default function ExercisesPage() {
  const [items, setItems] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPractica, setSelectedPractica] = useState<number | null>(null);

  useEffect(() => {
    async function fetchExercises() {
      try {
        const res = await fetch('/api/exercises');
        const data = await res.json();
        setItems(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
    fetchExercises();
  }, []);

  // Memoized calculations for performance
  const allTags = useMemo(() => getAllTags(items), [items]);
  const practicaNumbers = useMemo(() => 
    [...new Set(items.map(item => item.practica))].sort(), 
    [items]
  );

  // Filter exercises based on search and selected filters
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag === '' || 
        (Array.isArray(item.tags) && item.tags.includes(selectedTag));
      const matchesPractica = selectedPractica === null || 
        item.practica === selectedPractica;
      return matchesSearch && matchesTag && matchesPractica;
    });
  }, [items, searchQuery, selectedTag, selectedPractica]);

  // Group exercises by practica
  const exercisesByPractica = useMemo(() => {
    const grouped: { [key: number]: Exercise[] } = {};
    filteredItems.forEach(item => {
      if (!grouped[item.practica]) {
        grouped[item.practica] = [];
      }
      grouped[item.practica].push(item);
    });
    return grouped;
  }, [filteredItems]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[var(--color-accent)] border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Cargando ejercicios...</h2>
          <p className="text-[var(--color-text-secondary)]">Preparando tu experiencia de aprendizaje</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto p-4 space-y-8">
        
        {/* Header Section */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden">
          <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-[var(--color-accent)] rounded-lg">
                <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[var(--color-bg)] fill-none stroke-2">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[var(--color-text-primary)]">Ejercicios de Assembly</h1>
                <p className="text-xl text-[var(--color-text-secondary)]">Arquitectura de Computadores - Colección Completa</p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-[var(--color-bg)] rounded-lg p-3 text-center border border-[var(--color-border)]">
                <div className="text-2xl font-bold text-[var(--color-accent)]">{items.length}</div>
                <div className="text-sm text-[var(--color-text-secondary)] font-medium">Total Ejercicios</div>
              </div>
              <div className="bg-[var(--color-bg)] rounded-lg p-3 text-center border border-[var(--color-border)]">
                <div className="text-2xl font-bold text-[var(--color-accent)]">{practicaNumbers.length}</div>
                <div className="text-sm text-[var(--color-text-secondary)] font-medium">Prácticas</div>
              </div>
              <div className="bg-[var(--color-bg)] rounded-lg p-3 text-center border border-[var(--color-border)]">
                <div className="text-2xl font-bold text-[var(--color-accent)]">{allTags.length}</div>
                <div className="text-sm text-[var(--color-text-secondary)] font-medium">Temas</div>
              </div>
              <div className="bg-[var(--color-bg)] rounded-lg p-3 text-center border border-[var(--color-border)]">
                <div className="text-2xl font-bold text-[var(--color-accent)]">{filteredItems.length}</div>
                <div className="text-sm text-[var(--color-text-secondary)] font-medium">Filtrados</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[var(--color-text-primary)] fill-none stroke-2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Buscar y Filtrar</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Buscar por título
              </label>
              <input
                type="text"
                placeholder="Escribe para buscar..."
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:ring-1 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Tag Filter */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Filtrar por tema
              </label>
              <select
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text-primary)] focus:ring-1 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-all"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                <option value="">Todos los temas</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>

            {/* Practice Filter */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Filtrar por práctica
              </label>
              <select
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text-primary)] focus:ring-1 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition-all"
                value={selectedPractica || ''}
                onChange={(e) => setSelectedPractica(e.target.value ? parseInt(e.target.value) : null)}
              >
                <option value="">Todas las prácticas</option>
                {practicaNumbers.map(num => (
                  <option key={num} value={num}>Práctica {num}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedTag || searchQuery || selectedPractica) && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-[var(--color-text-secondary)] font-medium">Filtros activos:</span>
              {searchQuery && (
                <span className="bg-[var(--color-surface)] text-[var(--color-text-primary)] px-3 py-1 rounded-full text-sm font-medium border border-[var(--color-border)] flex items-center gap-2">
                  <span>"{searchQuery}"</span>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {selectedTag && (
                <span className="bg-[var(--color-surface)] text-[var(--color-text-primary)] px-3 py-1 rounded-full text-sm font-medium border border-[var(--color-border)] flex items-center gap-2">
                  <span>{selectedTag}</span>
                  <button 
                    onClick={() => setSelectedTag('')}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {selectedPractica && (
                <span className="bg-[var(--color-surface)] text-[var(--color-text-primary)] px-3 py-1 rounded-full text-sm font-medium border border-[var(--color-border)] flex items-center gap-2">
                  <span>Práctica {selectedPractica}</span>
                  <button 
                    onClick={() => setSelectedPractica(null)}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTag('');
                  setSelectedPractica(null);
                }}
                className="bg-[var(--color-surface)] text-[var(--color-text-primary)] px-3 py-1 rounded-full text-sm font-medium border border-[var(--color-border)] hover:bg-[var(--color-background-secondary)] transition-all"
              >
                Limpiar todo
              </button>
            </div>
          )}
        </div>

        {/* Exercises by Practica */}
        {Object.keys(exercisesByPractica).length === 0 ? (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-8 text-center">
            <svg viewBox="0 0 24 24" className="w-16 h-16 stroke-[var(--color-text-tertiary)] fill-none stroke-2 mx-auto mb-4">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">No se encontraron ejercicios</h3>
            <p className="text-[var(--color-text-secondary)]">Intenta ajustar tus filtros de búsqueda.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.keys(exercisesByPractica)
              .map(Number)
              .sort()
              .map(practicaNum => {
                const style = getPracticaStyle(practicaNum);
                const exercises = exercisesByPractica[practicaNum];
                
                return (
                  <div key={practicaNum} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden">
                    {/* Practice Header */}
                    <div className="bg-[var(--color-bg)] border-b border-[var(--color-border)] p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 flex items-center justify-center bg-[var(--color-accent)] rounded-lg">
                            <span className="text-[var(--color-bg)] font-bold text-sm">{style.badge}</span>
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Práctica {practicaNum}</h2>
                            <p className="text-[var(--color-text-secondary)]">{exercises.length} ejercicio{exercises.length !== 1 ? 's' : ''} disponible{exercises.length !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                        <div className="bg-[var(--color-accent)] bg-opacity-10 px-4 py-2 rounded-lg border border-[var(--color-accent)]">
                          <span className="font-bold text-[var(--color-accent)] text-lg">{exercises.length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Practice Exercises Grid */}
                    <div className="p-6">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {exercises.map((exercise) => (
                          <div 
                            key={exercise.id}
                            className={`${style.bg} ${style.border} border rounded-lg p-4 hover:border-[var(--color-accent)] transition-all duration-200 hover:scale-[1.02]`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h3 className={`font-semibold ${style.text} flex-1 pr-2`}>
                                {exercise.title}
                              </h3>
                              <span className={`${style.accent} text-[var(--color-bg)] px-2 py-1 rounded text-xs font-bold`}>
                                #{exercise.id}
                              </span>
                            </div>
                            
                            {/* Tags */}
                            {Array.isArray(exercise.tags) && exercise.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {exercise.tags.slice(0, 3).map((tag, index) => (
                                  <span 
                                    key={index}
                                    className="bg-[var(--color-bg)] text-[var(--color-text-secondary)] px-2 py-1 rounded text-xs font-medium border border-[var(--color-border)]"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {exercise.tags.length > 3 && (
                                  <span className="bg-[var(--color-bg)] text-[var(--color-text-tertiary)] px-2 py-1 rounded text-xs border border-[var(--color-border)]">
                                    +{exercise.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            )}

                            <Link 
                              href={`/exercises/${exercise.id}`}
                              className={`inline-flex items-center justify-center gap-2 ${style.accent} text-[var(--color-bg)] px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all w-full`}
                            >
                              <span>Resolver Ejercicio</span>
                              <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* Quick Start Tips */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[var(--color-accent)] fill-none stroke-2">
              <path d="M9 18h6M10 22h4M12 2v1M12 8v6M12 18v2M4.93 4.93l.7.7M18.36 4.93l-.7.7M4.93 19.07l.7-.7M18.36 19.07l-.7-.7M2 12h1M21 12h1" />
            </svg>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Consejos para Empezar</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center bg-[var(--color-accent)] rounded-lg">
                <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[var(--color-bg)] fill-none stroke-2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              </div>
              <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">Comienza Gradual</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">Empieza con la Práctica 1 y avanza progresivamente</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center bg-[var(--color-accent)] rounded-lg">
                <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[var(--color-bg)] fill-none stroke-2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">Usa los Filtros</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">Filtra por temas específicos para practicar</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center bg-[var(--color-accent)] rounded-lg">
                <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[var(--color-bg)] fill-none stroke-2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">Leé los Tags</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">Los tags indican el tipo de problema a resolver</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


