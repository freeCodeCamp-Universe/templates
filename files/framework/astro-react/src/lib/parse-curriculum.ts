import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { toString } from 'mdast-util-to-string';
import type { Heading, Root, RootContent } from 'mdast';
import type { Curriculum, Lesson, Module, Section } from './curriculum-types';
import { nodesToMarkdown } from './mdast-utils';
import { TASK_DEFINITIONS } from './tasks';

const processor = unified().use(remarkParse).use(remarkGfm);

const MARKER = /^--([a-z][a-z-]*)--$/;

function isHeadingDepth(node: RootContent, depth: number): node is Heading {
  return node.type === 'heading' && node.depth === depth;
}

function matchMarker(node: RootContent): string | null {
  if (node.type !== 'paragraph') {
    return null;
  }

  const match = toString(node).trim().match(MARKER);
  return match ? match[1] : null;
}

type Block = {
  markerType: string;
  nodes: RootContent[];
};

function splitIntoBlocks(nodes: RootContent[]): Block[] {
  const blocks: Block[] = [];
  let current: Block | null = null;

  for (const node of nodes) {
    const markerType = matchMarker(node);

    if (markerType) {
      current = { markerType, nodes: [] };
      blocks.push(current);
      continue;
    }

    current?.nodes.push(node);
  }

  return blocks;
}

function finalizeLessonContent(lesson: Lesson, nodes: RootContent[]): void {
  for (const block of splitIntoBlocks(nodes)) {
    if (block.markerType === 'text') {
      lesson.text = nodesToMarkdown(block.nodes);
      continue;
    }

    if (lesson.task) {
      throw new Error(
        `Lesson "${lesson.title}" already has a task; only one task per lesson is supported`,
      );
    }

    const definition = TASK_DEFINITIONS[block.markerType];
    if (!definition) {
      throw new Error(`Unknown task type "--${block.markerType}--" in lesson "${lesson.title}"`);
    }

    const candidate = { type: block.markerType, ...definition.parseContent(block.nodes) };

    try {
      lesson.task = definition.schema.parse(candidate);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(
        `Invalid "--${block.markerType}--" task in lesson "${lesson.title}": ${message}`,
        { cause: error },
      );
    }
  }
}

export function parseCurriculum(markdown: string, title: string): Curriculum {
  const tree = processor.parse(markdown) as Root;

  const sections: Section[] = [];
  let currentSection: Section | null = null;
  let currentModule: Module | null = null;
  let currentLesson: Lesson | null = null;
  let lessonNodes: RootContent[] = [];

  const flushLesson = () => {
    if (!currentLesson || !currentModule) {
      return;
    }

    finalizeLessonContent(currentLesson, lessonNodes);
    currentModule.lessons.push(currentLesson);
    currentLesson = null;
    lessonNodes = [];
  };

  for (const node of tree.children) {
    if (isHeadingDepth(node, 1)) {
      flushLesson();
      currentSection = { title: toString(node).trim(), modules: [] };
      sections.push(currentSection);
      currentModule = null;
      continue;
    }

    if (isHeadingDepth(node, 2)) {
      flushLesson();
      currentModule = { title: toString(node).trim(), lessons: [] };
      currentSection?.modules.push(currentModule);
      continue;
    }

    if (isHeadingDepth(node, 3)) {
      flushLesson();
      currentLesson = { title: toString(node).trim(), text: '', task: null };
      lessonNodes = [];
      continue;
    }

    if (!currentLesson) {
      continue;
    }

    lessonNodes.push(node);
  }

  flushLesson();

  return {
    title,
    sections,
  };
}
