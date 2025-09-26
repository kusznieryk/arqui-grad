import { z } from 'zod';

export const SubmissionCreateSchema = z.object({
  exerciseId: z.string().min(1),
  code: z.string().min(1).max(200_000),
});

export type SubmissionCreateInput = z.infer<typeof SubmissionCreateSchema>;

export const GradeResultSchema = z.object({
  es_correcto: z.boolean(),
  puntaje: z.number().min(0).max(100),
  errores: z.array(z.string()),
  sugerencias: z.array(z.string()),
  observaciones: z.string(),
});

export type GradeResult = z.infer<typeof GradeResultSchema>;


