import { prisma } from '@/lib/prisma';
import SubmitForm from './submit-form';

export default async function ExerciseDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ex = await prisma.exercise.findUnique({ where: { id }, select: { id: true, title: true, prompt: true, tags: true } });
  if (!ex) return <div className="p-6">No encontrado</div>;
  const subs = await prisma.submission.findMany({ where: { exerciseId: id }, orderBy: { createdAt: 'desc' }, take: 10, select: { id: true, createdAt: true, score: true, isCorrect: true, resultJson: true } });
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-center ">{ex.title}</h1>
        <pre className="whitespace-pre-wrap bg-black-500 p-3 rounded border text-sm">{ex.prompt}</pre>
      </div>
      <SubmitForm exerciseId={ex.id} />
    </div>
  );
}


