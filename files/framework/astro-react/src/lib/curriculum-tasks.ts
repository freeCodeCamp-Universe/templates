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

const ListeningChoiceTaskSchema = z
  .object({
    type: z.literal('listening-choice'),
    audioText: z.string().min(1),
    options: z.array(TaskOptionSchema).min(2),
  })
  .refine((task) => task.options.filter((option) => option.correct).length === 1, {
    message: 'Listening choice must have exactly one correct option',
  });

const WordBuilderTaskSchema = z
  .object({
    type: z.literal('word-builder'),
    prompt: z.string().min(1),
    tiles: z.array(z.string()).min(2),
    answer: z.array(z.string()).min(1),
  })
  .refine((task) => task.answer.length <= task.tiles.length, {
    message: 'Word builder answer cannot use more tiles than are available',
  })
  .refine((task) => task.answer.every((part) => task.tiles.includes(part)), {
    message: 'Word builder answer must only use tokens present in the tile pool',
  });

export type Task =
  | z.infer<typeof MultipleChoiceTaskSchema>
  | z.infer<typeof SelectAllThatApplyTaskSchema>
  | z.infer<typeof FillInBlankTaskSchema>
  | z.infer<typeof CategorizeTaskSchema>
  | z.infer<typeof OrderTaskSchema>
  | z.infer<typeof ListeningChoiceTaskSchema>
  | z.infer<typeof WordBuilderTaskSchema>;

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

function isLabeledParagraph(node: RootContent, label: string): boolean {
  return node.type === 'paragraph' && new RegExp(`^${label}:`, 'i').test(toString(node).trim());
}

function parseListeningChoiceContent(nodes: RootContent[]) {
  const audioNode = nodes.find((node) => isLabeledParagraph(node, 'Audio'));
  const listNode = nodes.find(isList);

  const audioLine = audioNode ? toString(audioNode).trim() : '';
  const audioText = audioLine
    .replace(/^Audio:\s*/i, '')
    .trim()
    .replace(/^"(.*)"$/, '$1')
    .trim();

  const options = (listNode?.children ?? []).map((item) => ({
    text: toString(item).trim(),
    correct: item.checked,
  }));

  return { audioText, options };
}

function parseWordBuilderContent(nodes: RootContent[]) {
  const paragraphs = nodes.filter((node) => node.type === 'paragraph');
  const tilesNode = paragraphs.find((node) => isLabeledParagraph(node, 'Tiles'));
  const answerNode = paragraphs.find((node) => isLabeledParagraph(node, 'Answer'));
  const promptNode = paragraphs.find((node) => node !== tilesNode && node !== answerNode);

  const prompt = promptNode ? nodesToMarkdown([promptNode]) : '';
  const tiles = tilesNode
    ? toString(tilesNode)
        .replace(/^Tiles:\s*/i, '')
        .split(',')
        .map((tile) => tile.trim())
        .filter(Boolean)
    : [];
  const answer = answerNode
    ? toString(answerNode)
        .replace(/^Answer:\s*/i, '')
        .split('/')
        .map((part) => part.trim())
        .filter(Boolean)
    : [];

  return { prompt, tiles, answer };
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
  'listening-choice': {
    schema: ListeningChoiceTaskSchema,
    parseContent: parseListeningChoiceContent,
  },
  'word-builder': {
    schema: WordBuilderTaskSchema,
    parseContent: parseWordBuilderContent,
  },
};
