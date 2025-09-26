import { GoogleGenerativeAI } from '@google/generative-ai';
import { GradeResult, GradeResultSchema } from '@/lib/zod';
import { sanitizeAsm } from "@/lib/sanitizer"; 
const MODEL_ID = 'gemini-2.5-flash-lite';
function buildPrompt(args: { promptEs: string; expectedAsm: string; studentAsm: string }) {
  const sanitized = sanitizeAsm(args.studentAsm);
  const { promptEs, expectedAsm, studentAsm } = args;
  if (sanitized.length === 0) {
    throw new Error("Sanitized code is empty");
  }
  return (
    'You are an expert teaching assistant for Computer Architecture courses.\n' +
    'Evaluate a student\'s Assembly solution against a hidden reference solution.\n' +
    'Output MUST be valid JSON, in Spanish, following the schema below.\n' +
    'Be strict but constructive. Focus on correctness, common assembly pitfalls,\n' +
    'edge cases, registers usage, memory addressing, calling conventions, and I/O handling.\n\n' +
    'ASSIGNMENT (Spanish):\n' + promptEs + '\n\n' +
    'REQUIREMENTS:\n' +
    '- Evaluate ONLY for the specified assembly target MSX86.\n' +
    '- If student\'s approach differs from reference but is correct, accept it.\n' +
    '- If incorrect, list the top issues clearly for a student audience.\n\n' +
    'REFERENCE_SOLUTION (secret, do not reveal to student):\n```asm\n' + expectedAsm + '\n```\n\n' +
    'STUDENT_CODE:\n\n```asm\n' + sanitized + '\n```\n\n' +
    'OUTPUT SCHEMA (return JSON in Spanish, no extra text):\n' +
    '{\n' +
    '  "es_correcto": boolean,\n' +
    '  "puntaje": number,\n' +
    '  "errores": string[],\n' +
    '  "sugerencias": string[],\n' +
    '  "observaciones": string\n' +
    '}'
  );
}
export async function gradeAssembly(args: {
  promptEs: string;
  expectedAsm: string;
  studentAsm: string;
}): Promise<{ parsed: GradeResult; raw: string }> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("Missing GOOGLE_API_KEY");
  
  const genAI = new GoogleGenerativeAI( apiKey );
  const model = genAI.getGenerativeModel({ model: MODEL_ID });

  const prompt = buildPrompt(args); // tu función actual

  // Recomendado: forzar JSON + (opcional) responseSchema
  const generation = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
      // Opcional: si querés enforcement a nivel de modelo:
      // responseSchema: {
      //   type: "object",
      //   properties: {
      //     es_correcto: { type: "boolean" },
      //     puntaje: { type: "number" },
      //     errores: { type: "array", items: { type: "string" }},
      //     sugerencias: { type: "array", items: { type: "string" }},
      //     observaciones: { type: "string" }
      //   },
      //   required: ["es_correcto", "puntaje", "errores", "sugerencias", "observaciones"],
      //   additionalProperties: false
      // }
    }
  });

  const raw = generation.response.text(); // debería ser JSON puro
  const parsedAttempt = safeParseJson(raw);
  if (parsedAttempt) {
    const z1 = GradeResultSchema.safeParse(parsedAttempt);
    if (z1.success) return { parsed: z1.data, raw };
  }

  // Fallback: segundo intento con recordatorio explícito
  const retry = await model.generateContent({
    contents: [{
      role: "user",
      parts: [{ text: `${prompt}\n\nRespond ONLY with JSON, no prose.` }]
    }],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json",
    },
  });

  const raw2 = retry.response.text();
  const parsed2 = safeParseJson(raw2);
  if (!parsed2) throw new Error("Respuesta no válida del LLM (no JSON).");

  const z2 = GradeResultSchema.safeParse(parsed2);
  if (!z2.success) throw new Error("JSON inválido devuelto por el LLM.");
  return { parsed: z2.data, raw: raw2 };
}

function safeParseJson(s: string): unknown | null {
  try {
    const trimmed = s.trim().replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}


