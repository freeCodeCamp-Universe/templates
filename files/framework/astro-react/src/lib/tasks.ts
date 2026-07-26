import { z } from 'astro/zod';

const TaskOption = z.object({
  text: z.string(),
  correct: z.boolean(),
});

const MultipleChoiceTask = z
  .object({
    type: z.literal('multiple-choice'),
    question: z.string(),
    options: z.array(TaskOption).min(2),
  })
  .refine((task) => task.options.filter((option) => option.correct).length === 1, {
    message: 'Multiple choice must have exactly one correct option',
  });

const SelectAllThatApplyTask = z
  .object({
    type: z.literal('select-all-that-apply'),
    question: z.string(),
    options: z.array(TaskOption).min(2),
  })
  .refine((task) => task.options.some((option) => option.correct), {
    message: 'Select-all-that-apply must have at least one correct option',
  });

export type Task = z.infer<typeof MultipleChoiceTask> | z.infer<typeof SelectAllThatApplyTask>;

const OPTION_LINE = /^\s*-\s*\[([ xX])\]\s*(.+)$/;

function parseOptionListContent(lines: string[]) {
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
    parseContent: parseOptionListContent,
  },
  'select-all-that-apply': {
    schema: SelectAllThatApplyTask,
    parseContent: parseOptionListContent,
  },
};
