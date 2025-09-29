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
      gradient: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      accent: 'bg-blue-500',
      icon: '📘'
    },
    2: {
      gradient: 'from-green-500 to-emerald-500',
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      accent: 'bg-green-500',
      icon: '📗'
    },
    3: {
      gradient: 'from-purple-500 to-pink-500',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-800',
      accent: 'bg-purple-500',
      icon: '📕'
    },
    default: {
      gradient: 'from-gray-500 to-slate-500',
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-800',
      accent: 'bg-gray-500',
      icon: '📚'
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
        console.error('Error fetching exercises:', error);
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800">Cargando ejercicios...</h2>
          <p className="text-gray-600">Preparando tu experiencia de aprendizaje</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-4 space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl">🎓</span>
              <div>
                <h1 className="text-4xl font-bold">Ejercicios de Assembly</h1>
                <p className="text-xl opacity-90">Arquitectura de Computadores - Colección Completa</p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white bg-opacity-90 rounded-lg p-3 text-center backdrop-blur-sm border border-white border-opacity-30">
                <div className="text-2xl font-bold text-indigo-700">{items.length}</div>
                <div className="text-sm text-indigo-600 font-medium">Total Ejercicios</div>
              </div>
              <div className="bg-white bg-opacity-90 rounded-lg p-3 text-center backdrop-blur-sm border border-white border-opacity-30">
                <div className="text-2xl font-bold text-purple-700">{practicaNumbers.length}</div>
                <div className="text-sm text-purple-600 font-medium">Prácticas</div>
              </div>
              <div className="bg-white bg-opacity-90 rounded-lg p-3 text-center backdrop-blur-sm border border-white border-opacity-30">
                <div className="text-2xl font-bold text-pink-700">{allTags.length}</div>
                <div className="text-sm text-pink-600 font-medium">Temas</div>
              </div>
              <div className="bg-white bg-opacity-90 rounded-lg p-3 text-center backdrop-blur-sm border border-white border-opacity-30">
                <div className="text-2xl font-bold text-indigo-700">{filteredItems.length}</div>
                <div className="text-sm text-indigo-600 font-medium">Filtrados</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🔍</span>
            <h2 className="text-xl font-bold text-gray-800">Buscar y Filtrar</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 Buscar por título
              </label>
              <input
                type="text"
                placeholder="Escribe para buscar..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Tag Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏷️ Filtrar por tema
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📚 Filtrar por práctica
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
              <span className="text-sm text-gray-800 font-medium">Filtros activos:</span>
              {searchQuery && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  🔍 "{searchQuery}"
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedTag && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  🏷️ {selectedTag}
                  <button 
                    onClick={() => setSelectedTag('')}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedPractica && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  📚 Práctica {selectedPractica}
                  <button 
                    onClick={() => setSelectedPractica(null)}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTag('');
                  setSelectedPractica(null);
                }}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-300 transition-all border border-gray-300"
              >
                Limpiar todo
              </button>
            </div>
          )}
        </div>

        {/* Exercises by Practica */}
        {Object.keys(exercisesByPractica).length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No se encontraron ejercicios</h3>
            <p className="text-gray-600">Intenta ajustar tus filtros de búsqueda.</p>
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
                  <div key={practicaNum} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                    {/* Practice Header */}
                    <div className={`bg-gradient-to-r ${style.gradient} p-6 text-white`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{style.icon}</span>
                          <div>
                            <h2 className="text-2xl font-bold">Práctica {practicaNum}</h2>
                            <p className="opacity-90">{exercises.length} ejercicio{exercises.length !== 1 ? 's' : ''} disponible{exercises.length !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                        <div className={`${style.accent} bg-opacity-20 px-4 py-2 rounded-full backdrop-blur-sm`}>
                          <span className="font-bold text-lg">{exercises.length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Practice Exercises Grid */}
                    <div className="p-6">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {exercises.map((exercise) => (
                          <div 
                            key={exercise.id}
                            className={`${style.bg} ${style.border} border rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:scale-[1.02]`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h3 className={`font-semibold ${style.text} flex-1 pr-2`}>
                                {exercise.title}
                              </h3>
                              <span className={`${style.accent} text-white px-2 py-1 rounded-full text-xs font-bold`}>
                                #{exercise.id}
                              </span>
                            </div>
                            
                            {/* Tags */}
                            {Array.isArray(exercise.tags) && exercise.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {exercise.tags.slice(0, 3).map((tag, index) => (
                                  <span 
                                    key={index}
                                    className="bg-white shadow-sm text-gray-800 px-2 py-1 rounded text-xs font-medium border border-gray-200"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {exercise.tags.length > 3 && (
                                  <span className="bg-white shadow-sm text-gray-600 px-2 py-1 rounded text-xs border border-gray-200">
                                    +{exercise.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            )}

                            <Link 
                              href={`/exercises/${exercise.id}`}
                              className={`inline-flex items-center gap-2 ${style.accent} text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all w-full justify-center`}
                            >
                              <span>🚀</span>
                              Resolver Ejercicio
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
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">💡</span>
            <h2 className="text-xl font-bold text-yellow-800">Consejos para Empezar</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold text-yellow-700 mb-1">Comienza Gradual</h3>
              <p className="text-sm text-yellow-600">Empieza con la Práctica 1 y avanza progresivamente</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🔍</div>
              <h3 className="font-semibold text-yellow-700 mb-1">Usa los Filtros</h3>
              <p className="text-sm text-yellow-600">Filtra por temas específicos para practicar</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📚</div>
              <h3 className="font-semibold text-yellow-700 mb-1">Lee los Tags</h3>
              <p className="text-sm text-yellow-600">Los tags indican el tipo de problema a resolver</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


