import type { Curriculum, Lesson, Module, Section } from './curriculum-types';
import { TASK_DEFINITIONS } from './tasks';

const SECTION_HEADING = /^#\s+/;
const MODULE_HEADING = /^##\s+/;
const LESSON_HEADING = /^###\s+/;
const TEXT_MARKER = /^--text--\s*$/;
const TASK_TYPE_MARKER = /^--([a-z][a-z-]*)--\s*$/;

export function parseCurriculum(markdown: string, title: string): Curriculum {
  const lines = markdown.trim().split(/\r?\n/);

  const sections: Section[] = [];
  let currentSection: Section | null = null;
  let currentModule: Module | null = null;
  let currentLesson: Lesson | null = null;
  let captureMode: 'text' | 'task' | null = null;
  let taskType: string | null = null;
  let taskLines: string[] = [];

  const finalizeTask = () => {
    if (!currentLesson || !taskType) {
      return;
    }

    const definition = TASK_DEFINITIONS[taskType];
    if (!definition) {
      throw new Error(`Unknown task type "--${taskType}--" in lesson "${currentLesson.title}"`);
    }

    const candidate = { type: taskType, ...definition.parseContent(taskLines) };

    try {
      currentLesson.task = definition.schema.parse(candidate);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(
        `Invalid "--${taskType}--" task in lesson "${currentLesson.title}": ${message}`,
        { cause: error },
      );
    }

    taskType = null;
    taskLines = [];
  };

  const flushLesson = () => {
    if (!currentLesson || !currentModule) {
      return;
    }

    finalizeTask();
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
      finalizeTask();
      captureMode = 'text';
      continue;
    }

    const taskTypeMatch = line.match(TASK_TYPE_MARKER);
    if (taskTypeMatch) {
      finalizeTask();
      captureMode = 'task';
      taskType = taskTypeMatch[1];
      taskLines = [];
      continue;
    }

    if (captureMode === 'text') {
      currentLesson.text += `${currentLesson.text ? '\n' : ''}${line}`.trim();
      continue;
    }

    if (captureMode === 'task') {
      taskLines.push(line);
    }
  }

  flushLesson();

  return {
    title,
    sections,
  };
}
