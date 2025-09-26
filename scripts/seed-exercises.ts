import { PrismaClient } from '../src/generated/prisma';
import { parseExercisesFile, resolveDataPath } from '../src/lib/exercises';
import fs from 'node:fs';

async function main() {
  const prisma = new PrismaClient();
  try {
    const dataPath = resolveDataPath();
    if (!fs.existsSync(dataPath)) {
      console.error('Missing data/exercises.txt');
      process.exit(1);
    }
    const parsed = parseExercisesFile(dataPath);
    for (const ex of parsed) {
      await prisma.exercise.upsert({
        where: { id: ex.id },
        update: {
          title: ex.title,
          prompt: ex.prompt,
          expectedSolution: ex.expectedSolution,
          tags: ex.tags,
        },
        create: {
          id: ex.id,
          practica: ex.practica,
          title: ex.title,
          prompt: ex.prompt,
          expectedSolution: ex.expectedSolution,
          tags: ex.tags,
        },
      });
    }
    console.log(`Seeded ${parsed.length} exercises.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


