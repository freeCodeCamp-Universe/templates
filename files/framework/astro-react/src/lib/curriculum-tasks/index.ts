import { z } from 'astro/zod';
import type { RootContent } from 'mdast';
import { MultipleChoiceTaskSchema } from './multiple-choice';
import { SelectAllThatApplyTaskSchema } from './select-all';
import { FillInBlankTaskSchema, parseFillInBlankContent } from './fill-in-the-blank';
import { CategorizeTaskSchema, parseCategorizeContent } from './categorize';
import { OrderTaskSchema, parseOrderContent } from './order';
import { CrosswordTaskSchema, parseCrosswordContent } from './crossword';
import { parseOptionListContent } from './option-list';

export type Task =
  | z.infer<typeof MultipleChoiceTaskSchema>
  | z.infer<typeof SelectAllThatApplyTaskSchema>
  | z.infer<typeof FillInBlankTaskSchema>
  | z.infer<typeof CategorizeTaskSchema>
  | z.infer<typeof OrderTaskSchema>
  | z.infer<typeof CrosswordTaskSchema>;

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
  crossword: {
    schema: CrosswordTaskSchema,
    parseContent: parseCrosswordContent,
  },
};
