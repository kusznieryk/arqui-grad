import fs from 'node:fs';
import path from 'node:path';

export type ParsedExercise = {
  id: string;
  practica: number;
  title: string;
  prompt: string;
  expectedSolution: string;
  tags: string[];
};

function parseBlock(block: string): ParsedExercise | null {
  const lines = block.split(/\r?\n/);
  let id = '';
  let practica = 1;
  let title = '';
  let prompt = '';
  let expectedSolution = '';
  let tags: string[] = [];

  let mode: 'none' | 'prompt' | 'expected' = 'none';
  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (mode === 'prompt') {
      if (line.startsWith('expected_solution:')) { mode = 'expected'; continue; }
      if (line === '---') { mode = 'none'; continue; }
      prompt += (prompt ? '\n' : '') + rawLine;
      continue;
    }
    if (mode === 'expected') {
      if (line === '---') { mode = 'none'; continue; }
      expectedSolution += (expectedSolution ? '\n' : '') + rawLine;
      continue;
    }

    if (line.startsWith('id:')) {
      id = line.slice(3).trim();
    } else if (line.startsWith('practica:')) {
      const num = parseInt(line.slice(9).trim(), 10);
      if (!isNaN(num)) practica = num;
    } else if (line.startsWith('title:')) {
      title = line.slice(6).trim();
    } else if (line.startsWith('tags:')) {
      const m = line.match(/\[(.*)\]/);
      if (m && m[1]) {
        tags = m[1].split(',').map(s => s.replace(/[\[\]\s]/g, '')).filter(Boolean);
      }
    } else if (line.startsWith('prompt:')) {
      mode = 'prompt';
    } else if (line.startsWith('expected_solution:')) {
      mode = 'expected';
    }
  }

  if (!id || !title || !prompt || !expectedSolution) return null;
  return { id, practica, title, prompt: prompt.replace(/^\|\s*/,'').trim(), expectedSolution: expectedSolution.replace(/^\|\s*/,'').trim(), tags };
}

export function parseExercisesFile(filePath: string): ParsedExercise[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const sections = content.split(/\n---\s*\n/).map(s => s.trim()).filter(Boolean);
  const results: ParsedExercise[] = [];
  for (const sec of sections) {
      const ex = parseBlock(sec);
      if (ex) results.push(ex);
  }
  return results;
}

export function resolveDataPath(): string {
  const projectRoot = path.resolve(process.cwd());
  return path.join(projectRoot, 'data', 'exercises.txt');
}

