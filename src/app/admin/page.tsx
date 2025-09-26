import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminPage() {
  const session = await getServerSession(authOptions as any);
  const isAdmin = (session as any)?.user?.isAdmin as boolean | undefined;
  if (!isAdmin) return <div className="p-6">No autorizado</div>;
  const [exCount, subCount] = await Promise.all([
    prisma.exercise.count(),
    prisma.submission.count(),
  ]);
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <div className="space-y-2">
        <div>Ejercicios: {exCount}</div>
        <div>Entregas: {subCount}</div>
      </div>
      <form action="/api/admin/reparse" method="post">
        <button className="px-3 py-2 bg-blue-600 text-white rounded" type="submit">Reparse exercises file</button>
      </form>
      <Link className="text-blue-700 underline" href="/exercises">Ir a ejercicios</Link>
    </div>
  );
}


