import type { Curriculum, Lesson, Module, Section } from './curriculum-types';

const SECTION_HEADING = /^#\s+/;
const MODULE_HEADING = /^##\s+/;
const LESSON_HEADING = /^###\s+/;
const TEXT_MARKER = /^--text--\s*$/;
const TASK_MARKER = /^--task--\s*$/;

function getFrontmatterTitle(markdown: string): string {
  const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---/);

  if (!frontmatterMatch) {
    return 'Untitled Curriculum';
  }

  const titleMatch = frontmatterMatch[1].match(/^title:\s*(.+)$/m);
  return titleMatch?.[1]?.trim() ?? 'Untitled Curriculum';
}

function stripFrontmatter(markdown: string): string {
  return markdown.replace(/^---\n[\s\S]*?\n---\n?/, '').trim();
}

export function parseCurriculum(markdown: string): Curriculum {
  const title = getFrontmatterTitle(markdown);
  const body = stripFrontmatter(markdown);
  const lines = body.split(/\r?\n/);

  const sections: Section[] = [];
  let currentSection: Section | null = null;
  let currentModule: Module | null = null;
  let currentLesson: Lesson | null = null;
  let captureMode: 'text' | 'task' | null = null;

  const flushLesson = () => {
    if (!currentLesson || !currentModule) {
      return;
    }

    currentModule.lessons.push(currentLesson);
    currentLesson = null;
    captureMode = null;
  };

  for (const line of lines) {
    if (SECTION_HEADING.test(line)) {
      flushLesson();
      currentSection = {
        title: line.replace(/^#\s+/, '').trim(),
        modules: [],
      };
      sections.push(currentSection);
      currentModule = null;
      continue;
    }

    if (MODULE_HEADING.test(line)) {
      flushLesson();
      currentModule = {
        title: line.replace(/^##\s+/, '').trim(),
        lessons: [],
      };
      currentSection?.modules.push(currentModule);
      continue;
    }

    if (LESSON_HEADING.test(line)) {
      flushLesson();
      currentLesson = {
        title: line.replace(/^###\s+/, '').trim(),
        text: '',
        task: null,
      };
      captureMode = null;
      continue;
    }

    if (!currentLesson) {
      continue;
    }

    if (TEXT_MARKER.test(line)) {
      captureMode = 'text';
      continue;
    }

    if (TASK_MARKER.test(line)) {
      captureMode = 'task';
      continue;
    }

    if (captureMode === 'text') {
      currentLesson.text += `${currentLesson.text ? '\n' : ''}${line}`.trim();
      continue;
    }

    if (captureMode === 'task') {
      currentLesson.task ??= '';
      currentLesson.task += `${currentLesson.task ? '\n' : ''}${line}`.trim();
    }
  }

  flushLesson();

  return {
    title,
    sections,
  };
}
