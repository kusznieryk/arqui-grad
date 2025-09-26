import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const items = await prisma.exercise.findMany({
    orderBy: { practica: 'asc' },
    select: { id: true, practica: true, title: true, prompt: true, tags: true, createdAt: true },
  });
  return NextResponse.json(items);
}


