'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Exercise {
  id: string;
  practica: number;
  title: string;
  tags: string[];
}

export default function ExercisesPage() {
  const [items, setItems] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Cargando ejercicios...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Ejercicios Practica 1</h1>
      {items.filter((it) => it.practica === 1).map((it) => (
        <li key={it.id} className="border rounded p-3">
          <div className="font-medium">{it.title}</div>
          <div className="text-sm text-gray-600">{Array.isArray(it.tags) ? it.tags.join(', ') : ''}</div>
          <Link className="text-blue-700 underline" href={`/exercises/${it.id}`}>Abrir</Link>
        </li>
      ))}
      
      <h1 className="text-2xl font-semibold">Ejercicios Practica 2</h1>
      {items.filter((it) => it.practica === 2).map((it) => (
        <li key={it.id} className="border rounded p-3">
          <div className="font-medium">{it.title}</div>
          <div className="text-sm text-gray-600">{Array.isArray(it.tags) ? it.tags.join(', ') : ''}</div>
          <Link className="text-blue-700 underline" href={`/exercises/${it.id}`}>Abrir</Link>
        </li>
      ))}
      
      <h1 className="text-2xl font-semibold">Ejercicios Practica 3</h1>
      {items.filter((it) => it.practica === 3).map((it) => (
        <li key={it.id} className="border rounded p-3">
          <div className="font-medium">{it.title}</div>
          <div className="text-sm text-gray-600">{Array.isArray(it.tags) ? it.tags.join(', ') : ''}</div>
          <Link className="text-blue-700 underline" href={`/exercises/${it.id}`}>Abrir</Link>
        </li>
      ))}
    </div>
  );
}


