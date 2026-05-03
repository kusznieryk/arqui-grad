import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminPage() {
  const session = await getServerSession(authOptions as any);
  const isAdmin = (session as any)?.user?.isAdmin as boolean | undefined;
  if (!isAdmin) return <div className="p-6 text-[var(--color-text-primary)]">No autorizado</div>;
  const [exCount, subCount] = await Promise.all([
    prisma.exercise.count(),
    prisma.submission.count(),
  ]);
  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Admin</h1>
        <div className="space-y-4">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4">
            <div className="text-[var(--color-text-secondary)] text-sm">Ejercicios</div>
            <div className="text-2xl font-bold text-[var(--color-accent)]">{exCount}</div>
          </div>
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4">
            <div className="text-[var(--color-text-secondary)] text-sm">Entregas</div>
            <div className="text-2xl font-bold text-[var(--color-accent)]">{subCount}</div>
          </div>
        </div>
        <form action="/api/admin/reparse" method="post">
          <button className="bg-[var(--color-accent)] text-[var(--color-bg)] px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all" type="submit">Reparse exercises file</button>
        </form>
        <Link className="text-[var(--color-accent)] underline hover:opacity-80 transition-all" href="/exercises">Ir a ejercicios</Link>
      </div>
    </div>
  );
}


