import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SubmissionCreateSchema } from '@/lib/zod';
import { gradeAssembly } from '@/services/gradeService';

const RATE_LIMIT_WINDOW_MS = 10_000;

const userLastCall = new Map<string, number>();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any);
  const userId = (session as any)?.user?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const now = Date.now();
  const last = userLastCall.get(userId) ?? 0;
  if (now - last < RATE_LIMIT_WINDOW_MS) {
    return NextResponse.json({ error: 'Demasiadas solicitudes, intenta en unos segundos' }, { status: 429 });
  }
  userLastCall.set(userId, now);

  const body = await req.json().catch(() => null);
  const parsed = SubmissionCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Entrada inválida' }, { status: 400 });
  const { exerciseId, code } = parsed.data;

  const exercise = await prisma.exercise.findUnique({ where: { id: exerciseId } });
  if (!exercise) return NextResponse.json({ error: 'Ejercicio no encontrado' }, { status: 404 });

  // Sanitize code (basic): ensure string and trim
  const codeSafe = String(code).slice(0, 200_000);

  try {
    const { parsed: graded, raw } = await gradeAssembly({ promptEs: exercise.prompt, expectedAsm: exercise.expectedSolution, studentAsm: codeSafe });
    const created = await prisma.submission.create({
      data: {
        userId,
        exerciseId: exercise.id,
        code: codeSafe,
        resultJson: graded as any,
        score: graded.puntaje,
        isCorrect: graded.es_correcto,
      },
      select: { id: true, createdAt: true, score: true, isCorrect: true, resultJson: true },
    });
    return NextResponse.json({ submission: created });
  } catch (e) {
    return NextResponse.json({ error: 'Fallo al evaluar. Intenta nuevamente más tarde.' }, { status: 500 });
  }
}


