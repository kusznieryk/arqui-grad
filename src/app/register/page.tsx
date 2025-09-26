"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(false);
    const res = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    if (!res.ok) setError('No se pudo registrar');
    else setOk(true);
  }

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Registrarse</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input className="w-full border px-3 py-2 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border px-3 py-2 rounded" placeholder="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {ok && <div className="text-green-700 text-sm">Registro exitoso. Ahora inicia sesión.</div>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Crear cuenta</button>
      </form>
      <div className="text-sm">
        ¿Ya tienes cuenta? <Link className="text-blue-700 underline" href="/login">Inicia sesión</Link>
      </div>
    </div>
  );
}


