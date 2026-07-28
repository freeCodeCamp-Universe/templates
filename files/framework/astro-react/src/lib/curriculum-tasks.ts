import { z } from 'astro/zod';
import type { List, RootContent } from 'mdast';
import { toString } from 'mdast-util-to-string';
import { nodesToMarkdown } from './mdast-utils';

const TaskOptionSchema = z.object({
  text: z.string(),
  correct: z.boolean(),
});

const MultipleChoiceTaskSchema = z
  .object({
    type: z.literal('multiple-choice'),
    question: z.string(),
    options: z.array(TaskOptionSchema).min(2),
  })
  .refine((task) => task.options.filter((option) => option.correct).length === 1, {
    message: 'Multiple choice must have exactly one correct option',
  });

const SelectAllThatApplyTaskSchema = z
  .object({
    type: z.literal('select-all-that-apply'),
    question: z.string(),
    options: z.array(TaskOptionSchema).min(2),
  })
  .refine((task) => task.options.some((option) => option.correct), {
    message: 'Select-all-that-apply must have at least one correct option',
  });

export type Task =
  z.infer<typeof MultipleChoiceTaskSchema> | z.infer<typeof SelectAllThatApplyTaskSchema>;

function isList(node: RootContent): node is List {
  return node.type === 'list';
}

function parseOptionListContent(nodes: RootContent[]) {
  const questionNode = nodes.find((node) => node.type === 'paragraph');
  const listNode = nodes.find(isList);

  const question = questionNode ? nodesToMarkdown([questionNode]) : '';
  const options = (listNode?.children ?? []).map((item) => ({
    text: toString(item).trim(),
    correct: item.checked,
  }));

  return { question, options };
}

type TaskDefinition = {
  schema: { parse: (candidate: unknown) => Task };
  parseContent: (nodes: RootContent[]) => Record<string, unknown>;
};

export const TASK_DEFINITIONS: Record<string, TaskDefinition> = {
  'multiple-choice': {
    schema: MultipleChoiceTaskSchema,
    parseContent: parseOptionListContent,
  },
  'select-all-that-apply': {
    schema: SelectAllThatApplyTaskSchema,
    parseContent: parseOptionListContent,
  },
};
