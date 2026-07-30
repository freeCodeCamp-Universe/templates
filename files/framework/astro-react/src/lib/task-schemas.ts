import { z } from 'astro/zod';

const TaskOptionSchema = z.object({
  text: z.string(),
  correct: z.boolean(),
});

const MultipleChoiceSchema = z
  .object({
    type: z.literal('MultipleChoice'),
    question: z.string(),
    options: z.array(TaskOptionSchema).min(2),
  })
  .refine((t) => t.options.filter((o) => o.correct).length === 1, {
    message: 'Multiple choice must have exactly one correct option',
  });

const SelectAllSchema = z
  .object({
    type: z.literal('SelectAll'),
    question: z.string(),
    options: z.array(TaskOptionSchema).min(2),
  })
  .refine((t) => t.options.some((o) => o.correct), {
    message: 'Select-all must have at least one correct option',
  });

const FillInTheBlankSchema = z
  .object({
    type: z.literal('FillInTheBlank'),
    segments: z.array(
      z.union([
        z.object({ kind: z.literal('text'), value: z.string() }),
        z.object({ kind: z.literal('blank'), answer: z.string() }),
      ]),
    ),
  })
  .refine((t) => t.segments.some((s) => s.kind === 'blank'), {
    message: 'Fill-in-the-blank must have at least one blank',
  });

export const ExtractedTaskSchema = z.union([
  MultipleChoiceSchema,
  SelectAllSchema,
  FillInTheBlankSchema,
]);
