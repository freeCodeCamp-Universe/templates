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
  z.object({ kind: z.literal('blank'), answers: z.array(z.string().min(1)).min(1) }),
]);

const FillInBlankTaskSchema = z
  .object({
    type: z.literal('fill-in-the-blank'),
    segments: z.array(FillInBlankSegmentSchema),
  })
  .refine((task) => task.segments.some((segment) => segment.kind === 'blank'), {
    message: 'Fill in the blank must have at least one blank',
  });

const CategorizeCategorySchema = z.object({
  name: z.string(),
  items: z.array(z.string()).min(1),
});

const CategorizeTaskSchema = z
  .object({
    type: z.literal('categorize'),
    question: z.string(),
    categories: z.array(CategorizeCategorySchema).min(2),
  })
  .refine(
    (task) => {
      const allItems = task.categories.flatMap((category) => category.items);
      return new Set(allItems).size === allItems.length;
    },
    { message: 'Categorize items must be unique across all categories' },
  );

const OrderTaskSchema = z
  .object({
    type: z.literal('order'),
    question: z.string(),
    items: z.array(z.string()).min(2),
  })
  .refine((task) => new Set(task.items).size === task.items.length, {
    message: 'Order items must be unique',
  });

export type Task =
  | z.infer<typeof MultipleChoiceTaskSchema>
  | z.infer<typeof SelectAllThatApplyTaskSchema>
  | z.infer<typeof FillInBlankTaskSchema>
  | z.infer<typeof CategorizeTaskSchema>
  | z.infer<typeof OrderTaskSchema>;

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

function parseBlankAnswers(raw: string) {
  const answers = raw
    .split('|')
    .map((answer) => answer.trim())
    .filter((answer) => answer !== '');

  if (answers.length > 0) {
    return answers;
  }

  // Every alternative was empty, so the blank holds a literal separator such as
  // {{|}} rather than a list of alternatives. A blank containing only
  // whitespace stays empty and fails validation.
  const literal = raw.trim();
  return literal === '' ? [] : [literal];
}

function parseFillInBlankContent(nodes: RootContent[]) {
  const text = nodes.map((node) => toString(node)).join(' ');
  const segments: Array<{ kind: 'text'; value: string } | { kind: 'blank'; answers: string[] }> =
    [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  BLANK.lastIndex = 0;
  while ((match = BLANK.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ kind: 'text', value: text.slice(lastIndex, match.index) });
    }
    segments.push({ kind: 'blank', answers: parseBlankAnswers(match[1]) });
    lastIndex = BLANK.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ kind: 'text', value: text.slice(lastIndex) });
  }

  return { segments };
}

function parseCategorizeContent(nodes: RootContent[]) {
  const questionNode = nodes.find((node) => node.type === 'paragraph');
  const listNode = nodes.find(isList);

  const question = questionNode ? nodesToMarkdown([questionNode]) : '';
  const categories = (listNode?.children ?? []).map((categoryItem) => {
    const nestedList = categoryItem.children.find(isList);
    const nameNode = categoryItem.children.find((child) => child.type !== 'list');
    const name = nameNode ? toString(nameNode).trim() : '';
    const items = (nestedList?.children ?? []).map((itemNode) => toString(itemNode).trim());

    return { name, items };
  });

  return { question, categories };
}

function parseOrderContent(nodes: RootContent[]) {
  const questionNode = nodes.find((node) => node.type === 'paragraph');
  const listNode = nodes.find(isList);

  const question = questionNode ? nodesToMarkdown([questionNode]) : '';
  const items = (listNode?.children ?? []).map((item) => toString(item).trim());

  return { question, items };
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
  categorize: {
    schema: CategorizeTaskSchema,
    parseContent: parseCategorizeContent,
  },
  order: {
    schema: OrderTaskSchema,
    parseContent: parseOrderContent,
  },
};
