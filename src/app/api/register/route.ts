import { prisma } from '@/lib/prisma';
import { RegisterSchema } from '@/lib/zod';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = RegisterSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  const { email, password } = parsed.data;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: 'Email ya registrado' }, { status: 400 });
  const passwordHash = await hash(password, 10);
  await prisma.user.create({ data: { email, password: passwordHash } });
  return NextResponse.json({ ok: true });
}


