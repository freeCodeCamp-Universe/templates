import { z } from 'astro/zod';

const MultipleChoiceOption = z.object({
  text: z.string(),
  correct: z.boolean(),
});

const MultipleChoiceTask = z
  .object({
    type: z.literal('multiple-choice'),
    question: z.string(),
    options: z.array(MultipleChoiceOption).min(2),
  })
  .refine((task) => task.options.filter((option) => option.correct).length === 1, {
    message: 'Multiple choice must have exactly one correct option',
  });

export type Task = z.infer<typeof MultipleChoiceTask>;

const OPTION_LINE = /^\s*-\s*\[([ xX])\]\s*(.+)$/;

function parseMultipleChoiceContent(lines: string[]) {
  const questionLines: string[] = [];
  const options: { text: string; correct: boolean }[] = [];

  for (const line of lines) {
    const optionMatch = line.match(OPTION_LINE);

    if (optionMatch) {
      options.push({
        text: optionMatch[2].trim(),
        correct: optionMatch[1].toLowerCase() === 'x',
      });
      continue;
    }

    if (line.trim()) {
      questionLines.push(line.trim());
    }
  }

  return {
    question: questionLines.join('\n'),
    options,
  };
}

type TaskDefinition = {
  schema: { parse: (candidate: unknown) => Task };
  parseContent: (lines: string[]) => Record<string, unknown>;
};

export const TASK_DEFINITIONS: Record<string, TaskDefinition> = {
  'multiple-choice': {
    schema: MultipleChoiceTask,
    parseContent: parseMultipleChoiceContent,
  },
};
