import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { parseExercisesFile, resolveDataPath } from '@/lib/exercises';
import fs from 'node:fs';

export async function POST() {
  const session = await getServerSession(authOptions as any);
  const isAdmin = (session as any)?.user?.isAdmin as boolean | undefined;
  if (!isAdmin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const p = resolveDataPath();
  if (!fs.existsSync(p)) return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
  const parsed = parseExercisesFile(p);
  for (const ex of parsed) {
    await prisma.exercise.upsert({
      where: { id: ex.id },
      update: { title: ex.title, practica: ex.practica, prompt: ex.prompt, expectedSolution: ex.expectedSolution, tags: ex.tags },
      create: { id: ex.id, practica: ex.practica, title: ex.title, prompt: ex.prompt, expectedSolution: ex.expectedSolution, tags: ex.tags },
    });
  }
  return NextResponse.json({ ok: true, count: parsed.length });
}


