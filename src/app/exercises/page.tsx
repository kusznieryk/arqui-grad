import Link from 'next/link';

async function fetchExercises() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/exercises`);
  return res.json();
}

export default async function ExercisesPage() {
  const items = await fetchExercises();
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Ejercicios Practica 1</h1>

        {items.filter((it: any) => it.practica === 1).map((it: any) => (
          <li key={it.id} className="border rounded p-3">
            <div className="font-medium">{it.title}</div>
            <div className="text-sm text-gray-600">{Array.isArray(it.tags) ? it.tags.join(', ') : ''}</div>
            <Link className="text-blue-700 underline" href={`/exercises/${it.id}`}>Abrir</Link>
          </li>
        ))}
      <h1 className="text-2xl font-semibold">Ejercicios Practica 2</h1>
        {items.filter((it: any) => it.practica === 2).map((it: any) => (
          <li key={it.id} className="border rounded p-3">
            <div className="font-medium">{it.title}</div>
            <div className="text-sm text-gray-600">{Array.isArray(it.tags) ? it.tags.join(', ') : ''}</div>
            <Link className="text-blue-700 underline" href={`/exercises/${it.id}`}>Abrir</Link>
          </li>
        ))}
      <h1 className="text-2xl font-semibold">Ejercicios Practica 3</h1>

        {items.filter((it: any) => it.practica === 3).map((it: any) => (
          <li key={it.id} className="border rounded p-3">
            <div className="font-medium">{it.title}</div>
            <div className="text-sm text-gray-600">{Array.isArray(it.tags) ? it.tags.join(', ') : ''}</div>
            <Link className="text-blue-700 underline" href={`/exercises/${it.id}`}>Abrir</Link>
          </li>
        ))}
    </div>
  );
}


