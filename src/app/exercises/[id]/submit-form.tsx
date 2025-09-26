"use client";
import { useState } from 'react';

export default function SubmitForm({ exerciseId }: { exerciseId: string }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setResult(null);
    const res = await fetch('/api/submissions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ exerciseId, code }) });
    setLoading(false);
    if (!res.ok) { setError('No se pudo enviar la solución'); return; }
    const json = await res.json();
    setResult(json.submission?.resultJson);
  }

  return (
    <div className="space-y-3">
      <form className="space-y-2" onSubmit={onSubmit}>
        <textarea className="w-full border rounded p-2 font-mono" rows={10} placeholder="Pega tu código ASM aquí" value={code} onChange={e=>setCode(e.target.value)} />
        <button className="px-3 py-2 bg-green-600 text-white rounded" type="submit" disabled={loading}>{loading ? 'Evaluando...' : 'Enviar'}</button>
      </form>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {result && (
        <div className="border rounded p-3">
          <div><b>Estado:</b> {result.es_correcto ? 'Correcto' : 'Incorrecto'}</div>
          <div><b>Puntaje:</b> {result.puntaje}/100</div>
          <div className="mt-2">
            <b>Errores:</b>
            <ul className="list-disc pl-6">{result.errores?.map((e: string, i: number) => <li key={i}>{e}</li>)}</ul>
          </div>
          <div className="mt-2">
            <b>Sugerencias:</b>
            <ul className="list-disc pl-6">{result.sugerencias?.map((e: string, i: number) => <li key={i}>{e}</li>)}</ul>
          </div>
          <div className="mt-2"><b>Observaciones:</b> {result.observaciones}</div>
        </div>
      )}
    </div>
  );
}


