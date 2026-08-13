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

const CategorizeSchema = z
  .object({
    type: z.literal('Categorize'),
    question: z.string(),
    categories: z
      .array(
        z.object({
          name: z.string(),
          items: z.array(z.string()).min(1),
        }),
      )
      .min(2),
  })
  .refine(
    (task) => {
      const items = task.categories.flatMap((category) => category.items);
      return new Set(items).size === items.length;
    },
    { message: 'Categorize items must be unique across all categories' },
  );

const OrderSchema = z
  .object({
    type: z.literal('Order'),
    question: z.string(),
    items: z.array(z.string()).min(2),
  })
  .refine((task) => new Set(task.items).size === task.items.length, {
    message: 'Order items must be unique',
  });

const MatchPairsSchema = z.object({
  type: z.literal('MatchPairs'),
  pairs: z
    .array(
      z.object({
        left: z.string(),
        right: z.string(),
      }),
    )
    .min(2),
});

export const ExtractedTaskSchema = z.union([
  MultipleChoiceSchema,
  SelectAllSchema,
  FillInTheBlankSchema,
  CategorizeSchema,
  OrderSchema,
  MatchPairsSchema,
]);
