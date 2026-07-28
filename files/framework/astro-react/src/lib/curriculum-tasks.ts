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

const FillInBlankSegmentSchema = z.union([
  z.object({ kind: z.literal('text'), value: z.string() }),
  z.object({ kind: z.literal('blank'), answer: z.string() }),
]);

const FillInBlankTaskSchema = z
  .object({
    type: z.literal('fill-in-the-blank'),
    segments: z.array(FillInBlankSegmentSchema),
  })
  .refine((task) => task.segments.some((segment) => segment.kind === 'blank'), {
    message: 'Fill in the blank must have at least one blank',
  });

export type Task =
  | z.infer<typeof MultipleChoiceTaskSchema>
  | z.infer<typeof SelectAllThatApplyTaskSchema>
  | z.infer<typeof FillInBlankTaskSchema>;

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

const BLANK = /\{\{([^}]+)\}\}/g;

function parseFillInBlankContent(nodes: RootContent[]) {
  const text = nodes.map((node) => toString(node)).join(' ');
  const segments: Array<{ kind: 'text'; value: string } | { kind: 'blank'; answer: string }> = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  BLANK.lastIndex = 0;
  while ((match = BLANK.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ kind: 'text', value: text.slice(lastIndex, match.index) });
    }
    segments.push({ kind: 'blank', answer: match[1].trim() });
    lastIndex = BLANK.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ kind: 'text', value: text.slice(lastIndex) });
  }

  return { segments };
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
  'fill-in-the-blank': {
    schema: FillInBlankTaskSchema,
    parseContent: parseFillInBlankContent,
  },
};
