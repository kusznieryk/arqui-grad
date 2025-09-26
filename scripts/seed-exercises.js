// ESM-friendly simple seed in plain JS to avoid ts-node loader issues
import { PrismaClient } from '../src/generated/prisma/index.js';
import fs from 'node:fs';
import path from 'node:path';

function parseBlocks(content) {
  const sections = content.split(/\n---\s*\n/).map((s) => s.trim()).filter(Boolean);
  const results = [];

  for (const sec of sections) {
    const lines = sec.split(/\r?\n/);
    let id = '', practica = 1, title = '', prompt = '', expected = '', tags = [];
    let mode = 'none';
    for (const raw of lines) {
      const line = raw.trimEnd();
      if (mode === 'prompt') {
        if (line.startsWith('expected_solution:')) { mode = 'expected'; continue; }
        prompt += (prompt ? '\n' : '') + raw;
        continue;
      }
      if (mode === 'expected') {
        expected += (expected ? '\n' : '') + raw;
        continue;
      }
      if (line.startsWith('id:')) id = line.slice(3).trim();
      if (line.startsWith('practica:')) {
        const num = parseInt(line.slice(9).trim(), 10);
        if (!isNaN(num)) practica = num;
      }
      else if (line.startsWith('title:')) title = line.slice(6).trim();
      else if (line.startsWith('tags:')) {
        const m = line.match(/\[(.*)\]/); tags = m && m[1] ? m[1].split(',').map(s=>s.replace(/[\[\]\s]/g,'')).filter(Boolean) : [];
      } else if (line.startsWith('prompt:')) mode = 'prompt';
      else if (line.startsWith('expected_solution:')) mode = 'expected';
    }
    prompt = prompt.replace(/^\|\s*/, '').trim();
    expected = expected.replace(/^\|\s*/, '').trim();
    console.log(`Upserting exercise ${id} - ${title}`);

    if (id && title && prompt && expected) results.push({ id, practica, title, prompt, expectedSolution: expected, tags });
  }
  return results;
}

async function main() {
  const prisma = new PrismaClient();
  const dataPath = path.join(process.cwd(), 'data', 'exercises.txt');
  if (!fs.existsSync(dataPath)) throw new Error('Missing data/exercises.txt');
  const content = fs.readFileSync(dataPath, 'utf8');
  const parsed = parseBlocks(content);
  for (const ex of parsed) {
    await prisma.exercise.upsert({
      where: { id: ex.id },
      update: { practica: ex.practica, title: ex.title, prompt: ex.prompt, expectedSolution: ex.expectedSolution, tags: ex.tags },
      create: { id: ex.id, practica: ex.practica, title: ex.title, prompt: ex.prompt, expectedSolution: ex.expectedSolution, tags: ex.tags },
    });
  }
  console.log(`Seeded ${parsed.length} exercises.`);
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });


