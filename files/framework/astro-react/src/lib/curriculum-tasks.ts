import { z } from 'astro/zod';
import type { Code, List, RootContent } from 'mdast';
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

type CrosswordCell = string | null;
type CrosswordGrid = CrosswordCell[][];
type CrosswordWordStart = { row: number; col: number; length: number };

function cellAt(grid: CrosswordGrid, row: number, col: number): CrosswordCell {
  return grid[row]?.[col] ?? null;
}

function isRectangularGrid(grid: CrosswordGrid): boolean {
  return grid.length > 0 && grid[0].length > 0 && grid.every((row) => row.length === grid[0].length);
}

function findAcrossStarts(grid: CrosswordGrid): CrosswordWordStart[] {
  const starts: CrosswordWordStart[] = [];

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (!cellAt(grid, row, col)) continue;

      const isStart = col === 0 || !cellAt(grid, row, col - 1);
      const hasNext = Boolean(cellAt(grid, row, col + 1));
      if (!isStart || !hasNext) continue;

      let length = 0;
      while (cellAt(grid, row, col + length)) length++;
      starts.push({ row, col, length });
    }
  }

  return starts;
}

function findDownStarts(grid: CrosswordGrid): CrosswordWordStart[] {
  const starts: CrosswordWordStart[] = [];
  const rowCount = grid.length;
  const colCount = grid.reduce((max, row) => Math.max(max, row.length), 0);

  for (let col = 0; col < colCount; col++) {
    for (let row = 0; row < rowCount; row++) {
      if (!cellAt(grid, row, col)) continue;

      const isStart = row === 0 || !cellAt(grid, row - 1, col);
      const hasNext = Boolean(cellAt(grid, row + 1, col));
      if (!isStart || !hasNext) continue;

      let length = 0;
      while (cellAt(grid, row + length, col)) length++;
      starts.push({ row, col, length });
    }
  }

  return starts;
}

function coveredCellKeys(starts: CrosswordWordStart[], axis: 'across' | 'down'): Set<string> {
  const keys = new Set<string>();

  for (const start of starts) {
    for (let i = 0; i < start.length; i++) {
      const row = axis === 'across' ? start.row : start.row + i;
      const col = axis === 'across' ? start.col + i : start.col;
      keys.add(`${row},${col}`);
    }
  }

  return keys;
}

function everyLetterIsPartOfAWord(grid: CrosswordGrid): boolean {
  const covered = new Set([
    ...coveredCellKeys(findAcrossStarts(grid), 'across'),
    ...coveredCellKeys(findDownStarts(grid), 'down'),
  ]);

  return grid.every((row, rowIndex) =>
    row.every((cell, colIndex) => !cell || covered.has(`${rowIndex},${colIndex}`)),
  );
}

function isSingleConnectedGroup(grid: CrosswordGrid): boolean {
  const letterCells: Array<[number, number]> = [];
  grid.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell) letterCells.push([rowIndex, colIndex]);
    });
  });

  if (letterCells.length === 0) {
    return false;
  }

  const visited = new Set<string>([`${letterCells[0][0]},${letterCells[0][1]}`]);
  const stack: Array<[number, number]> = [letterCells[0]];
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ] as const;

  while (stack.length > 0) {
    const [row, col] = stack.pop()!;
    for (const [deltaRow, deltaCol] of directions) {
      const nextRow = row + deltaRow;
      const nextCol = col + deltaCol;
      const key = `${nextRow},${nextCol}`;
      if (visited.has(key) || !cellAt(grid, nextRow, nextCol)) continue;
      visited.add(key);
      stack.push([nextRow, nextCol]);
    }
  }

  return visited.size === letterCells.length;
}

function acrossClueCountMatchesGrid(task: { solution: CrosswordGrid; clues: { direction: string }[] }): boolean {
  return (
    findAcrossStarts(task.solution).length === task.clues.filter((clue) => clue.direction === 'across').length
  );
}

function downClueCountMatchesGrid(task: { solution: CrosswordGrid; clues: { direction: string }[] }): boolean {
  return findDownStarts(task.solution).length === task.clues.filter((clue) => clue.direction === 'down').length;
}

const CrosswordClueSchema = z.object({
  direction: z.enum(['across', 'down']),
  clue: z.string(),
  row: z.number(),
  col: z.number(),
  length: z.number(),
});

const CrosswordTaskSchema = z
  .object({
    type: z.literal('crossword'),
    question: z.string(),
    solution: z.array(
      z.array(z.string().regex(/^[A-Z]$/, 'Crossword grid cells must be a single letter or "."').nullable()),
    ),
    clues: z.array(CrosswordClueSchema),
  })
  .refine((task) => isRectangularGrid(task.solution), {
    message: 'Crossword grid must be non-empty and every row must be the same length',
  })
  .refine((task) => task.clues.length > 0, {
    message: 'Crossword must have at least one clue',
  })
  .refine(acrossClueCountMatchesGrid, {
    message: 'Crossword must list exactly as many Across clues as across words found in the grid',
  })
  .refine(downClueCountMatchesGrid, {
    message: 'Crossword must list exactly as many Down clues as down words found in the grid',
  })
  .refine((task) => everyLetterIsPartOfAWord(task.solution), {
    message: 'Crossword has a letter that is not part of any across or down word of at least two letters',
  })
  .refine((task) => isSingleConnectedGroup(task.solution), {
    message: 'Crossword words must all connect into a single grid',
  });

export type Task =
  | z.infer<typeof MultipleChoiceTaskSchema>
  | z.infer<typeof SelectAllThatApplyTaskSchema>
  | z.infer<typeof FillInBlankTaskSchema>
  | z.infer<typeof CategorizeTaskSchema>
  | z.infer<typeof OrderTaskSchema>
  | z.infer<typeof CrosswordTaskSchema>;

function isList(node: RootContent): node is List {
  return node.type === 'list';
}

function isCode(node: RootContent): node is Code {
  return node.type === 'code';
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

// Alternatives are separated by "|". An answer that contains a pipe of its own
// escapes it as "\|", which authors write as "\\|" in markdown because the
// markdown parser consumes one backslash before this runs.
const UNESCAPED_PIPE = /(?<!\\)\|/;
const ESCAPED_PIPE = /\\\|/g;

function parseBlankAnswers(raw: string) {
  const answers = raw
    .split(UNESCAPED_PIPE)
    .map((answer) => answer.replace(ESCAPED_PIPE, '|').trim())
    .filter((answer) => answer !== '');

  if (answers.length > 0) {
    return answers;
  }

  // Every alternative was empty, so the blank holds unescaped separators such
  // as {{|}} and is read literally. A blank containing only whitespace stays
  // empty and fails validation.
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

function buildCrosswordSolution(nodes: RootContent[]): CrosswordGrid {
  const gridText = nodes.find(isCode)?.value ?? '';

  return gridText
    .split('\n')
    .filter((line) => line.length > 0)
    .map((line) => line.split('').map((char) => (char === '.' ? null : char.toUpperCase())));
}

function findCrosswordClueTexts(nodes: RootContent[], label: 'across' | 'down'): string[] {
  const labelIndex = nodes.findIndex(
    (node) => node.type === 'paragraph' && toString(node).trim().toLowerCase().replace(/:$/, '') === label,
  );
  if (labelIndex === -1) {
    return [];
  }

  const listNode = nodes.slice(labelIndex + 1).find(isList);
  return (listNode?.children ?? []).map((item) => toString(item).trim());
}

function parseCrosswordContent(nodes: RootContent[]) {
  const questionNode = nodes.find((node) => node.type === 'paragraph');
  const question = questionNode ? nodesToMarkdown([questionNode]) : '';
  const solution = buildCrosswordSolution(nodes);
  const acrossStarts = findAcrossStarts(solution);
  const downStarts = findDownStarts(solution);

  const acrossClues = findCrosswordClueTexts(nodes, 'across').map((clue, index) => ({
    direction: 'across' as const,
    clue,
    row: acrossStarts[index]?.row ?? -1,
    col: acrossStarts[index]?.col ?? -1,
    length: acrossStarts[index]?.length ?? 0,
  }));

  const downClues = findCrosswordClueTexts(nodes, 'down').map((clue, index) => ({
    direction: 'down' as const,
    clue,
    row: downStarts[index]?.row ?? -1,
    col: downStarts[index]?.col ?? -1,
    length: downStarts[index]?.length ?? 0,
  }));

  return { question, solution, clues: [...acrossClues, ...downClues] };
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
  crossword: {
    schema: CrosswordTaskSchema,
    parseContent: parseCrosswordContent,
  },
};
