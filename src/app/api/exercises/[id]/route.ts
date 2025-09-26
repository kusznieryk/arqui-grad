import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const ex = await prisma.exercise.findUnique({
    where: { id },
    select: { id: true, title: true, prompt: true, tags: true, createdAt: true },
  });
  if (!ex) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  return NextResponse.json(ex);
}


