/**
 * Parses a Curriculum Press project export into the same `Curriculum` structure
 * that `parse-curriculum.ts` produces from markdown.
 *
 * Curriculum Press only knows four generic element kinds (`text`, `markdown`,
 * `code`, `json`); all meaning lives in the author-chosen element `id` and in
 * the element order. The contract this parser expects is documented in
 * `README.md` and encoded in `curriculum-template.json`.
 */

import { TASK_DEFINITIONS, type Task } from '../curriculum-tasks';
import type { Curriculum, Lesson, LessonContentBlock, Module, Section } from '../curriculum-types';
import type {
  CurriculumPressElement,
  CurriculumPressLesson,
  CurriculumPressProject,
  JsonValue,
} from './curriculum-press-types';

/** A `text` element with this id sets the lesson title instead of adding content. */
export const TITLE_ELEMENT_ID = 'title';

const ELEMENT_KINDS = ['text', 'markdown', 'code', 'json'] as const;
const PLAIN_LANGUAGE = 'plaintext';

export type ParseCurriculumPressOptions = {
  /** Curriculum title. Defaults to the exported project name. */
  title?: string;
  description?: string;
};

export function parseCurriculumPress(
  payload: unknown,
  options: ParseCurriculumPressOptions = {},
): Curriculum {
  const project = asProject(payload);

  const sections: Section[] = [];
  const sectionsByTitle = new Map<string, Section>();
  const modulesByKey = new Map<string, Module>();

  for (const [index, pressLesson] of project.lessons.entries()) {
    const path = project.layout[index] ?? pressLesson.name;
    const { sectionTitle, moduleTitle, lessonTitle } = splitLayoutPath(
      path,
      project.name,
      pressLesson.name,
    );

    let section = sectionsByTitle.get(sectionTitle);
    if (!section) {
      section = { title: sectionTitle, modules: [] };
      sectionsByTitle.set(sectionTitle, section);
      sections.push(section);
    }

    const moduleKey = `${sectionTitle}/${moduleTitle}`;
    let module = modulesByKey.get(moduleKey);
    if (!module) {
      module = { title: moduleTitle, lessons: [] };
      modulesByKey.set(moduleKey, module);
      section.modules.push(module);
    }

    module.lessons.push(parseLesson(pressLesson, lessonTitle));
  }

  return {
    title: options.title ?? project.name,
    description: options.description,
    sections,
  };
}

/**
 * Layout paths are "<project>/<folder>/.../<lesson>". Two folders map cleanly
 * onto section and module; the shallower and deeper cases are folded so no
 * lesson is ever dropped:
 *
 *   no folders      section and module both take the project name
 *   one folder      the folder is the section, and is reused as the module title
 *   three or more   the first folder is the section, the rest join as the module
 */
function splitLayoutPath(
  path: string,
  projectName: string,
  lessonName: string,
): { sectionTitle: string; moduleTitle: string; lessonTitle: string } {
  const segments = path
    .split('/')
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);

  if (segments[0]?.toLowerCase() === projectName.toLowerCase()) {
    segments.shift();
  }

  const leaf = segments.pop() ?? lessonName;
  const folders = segments;

  if (folders.length === 0) {
    return { sectionTitle: projectName, moduleTitle: projectName, lessonTitle: leaf };
  }

  if (folders.length === 1) {
    return { sectionTitle: folders[0], moduleTitle: folders[0], lessonTitle: leaf };
  }

  return {
    sectionTitle: folders[0],
    moduleTitle: folders.slice(1).join(' / '),
    lessonTitle: leaf,
  };
}

function parseLesson(pressLesson: CurriculumPressLesson, fallbackTitle: string): Lesson {
  const lesson: Lesson = { title: fallbackTitle, content: [] };

  for (const element of pressLesson.elements) {
    if (element.kind === 'text' && element.id === TITLE_ELEMENT_ID) {
      const title = element.value.trim();
      if (title) {
        lesson.title = title;
      }
      continue;
    }

    lesson.content.push(...parseElement(element, lesson.title));
  }

  return lesson;
}

function parseElement(element: CurriculumPressElement, lessonTitle: string): LessonContentBlock[] {
  switch (element.kind) {
    case 'text':
    case 'markdown': {
      const markdown = element.value.trim();
      return markdown ? [{ type: 'text', markdown }] : [];
    }
    case 'code': {
      const code = element.value.replace(/\s+$/, '');
      return code ? [{ type: 'text', markdown: toFencedCode(code, element.language) }] : [];
    }
    case 'json':
      return parseTaskElement(element, lessonTitle).map((task) => ({ type: 'task', task }));
  }
}

/**
 * A `json` element carries one task object, or an array of them. Each object is
 * validated by the same schema `parse-curriculum.ts` uses, so a task authored in
 * Curriculum Press and a task authored in markdown cannot diverge.
 */
function parseTaskElement(
  element: Extract<CurriculumPressElement, { kind: 'json' }>,
  lessonTitle: string,
): Task[] {
  const value = typeof element.value === 'string' ? parseJsonText(element, lessonTitle) : element.value;

  if (value === null) {
    return [];
  }

  const candidates = Array.isArray(value) ? value : [value];

  return candidates.map((candidate) => {
    if (!isRecord(candidate)) {
      throw new Error(
        `Element "${element.id}" in lesson "${lessonTitle}" must contain a task object, or an array of them`,
      );
    }

    const type = candidate['type'];
    if (typeof type !== 'string') {
      throw new Error(
        `Task in element "${element.id}" of lesson "${lessonTitle}" is missing a string "type"`,
      );
    }

    const definition = TASK_DEFINITIONS[type];
    if (!definition) {
      throw new Error(
        `Unknown task type "${type}" in element "${element.id}" of lesson "${lessonTitle}"`,
      );
    }

    try {
      return definition.schema.parse(candidate);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(
        `Invalid "${type}" task in element "${element.id}" of lesson "${lessonTitle}": ${message}`,
        { cause: error },
      );
    }
  });
}

/**
 * A Curriculum Press export writes `json` values as real inline JSON, but a
 * hand-written or hand-edited export may carry a JSON string instead.
 */
function parseJsonText(
  element: Extract<CurriculumPressElement, { kind: 'json' }>,
  lessonTitle: string,
): JsonValue {
  const text = String(element.value).trim();
  if (text.length === 0) {
    return null;
  }

  try {
    return JSON.parse(text) as JsonValue;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Element "${element.id}" in lesson "${lessonTitle}" is not valid JSON: ${message}`,
      { cause: error },
    );
  }
}

/** Fence length grows past any backtick run in the code, so nesting cannot break out. */
function toFencedCode(code: string, language: string): string {
  const longestRun = Math.max(0, ...[...code.matchAll(/`+/g)].map((match) => match[0].length));
  const fence = '`'.repeat(Math.max(3, longestRun + 1));
  const info = language && language !== PLAIN_LANGUAGE ? language : '';
  return `${fence}${info}\n${code}\n${fence}`;
}

/* ------------------------------------------------------------------- guards */

function asProject(payload: unknown): CurriculumPressProject {
  if (!isRecord(payload)) {
    throw new Error('Curriculum Press export must be a JSON object');
  }

  const name = payload['name'];
  if (typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Curriculum Press export is missing a "name"');
  }

  const rawLessons = payload['lessons'];
  if (!Array.isArray(rawLessons)) {
    throw new Error('Curriculum Press export is missing a "lessons" array');
  }

  const rawLayout = payload['layout'];
  const layout = Array.isArray(rawLayout)
    ? rawLayout.filter((entry): entry is string => typeof entry === 'string')
    : [];

  const lessons = rawLessons.map((raw, index) => asLesson(raw, index));

  return {
    project_id: asString(payload['project_id']) ?? '',
    name,
    created_at: asString(payload['created_at']) ?? '',
    updated_at: asString(payload['updated_at']) ?? '',
    layout,
    lessons,
  };
}

function asLesson(raw: unknown, index: number): CurriculumPressLesson {
  if (!isRecord(raw)) {
    throw new Error(`Lesson ${index + 1} in the Curriculum Press export is not an object`);
  }

  const name = asString(raw['name']) ?? `lesson-${index + 1}`;
  const rawElements = raw['elements'];
  if (rawElements !== undefined && !Array.isArray(rawElements)) {
    throw new Error(`Lesson "${name}" has an "elements" field that is not an array`);
  }

  const elements = (rawElements ?? []).map((element, elementIndex) =>
    asElement(element, name, elementIndex),
  );

  return { id: asString(raw['id']) ?? '', name, elements };
}

function asElement(raw: unknown, lessonName: string, index: number): CurriculumPressElement {
  if (!isRecord(raw)) {
    throw new Error(`Element ${index + 1} of lesson "${lessonName}" is not an object`);
  }

  const kind = asElementKind(raw['kind']);
  if (!kind) {
    throw new Error(
      `Element ${index + 1} of lesson "${lessonName}" has unknown kind "${String(raw['kind'])}"`,
    );
  }

  const id = asString(raw['id']) ?? `${kind}-${index + 1}`;

  switch (kind) {
    case 'json':
      return { kind, id, value: (raw['value'] ?? null) as JsonValue };
    case 'code':
      return {
        kind,
        id,
        // Curriculum Press's own README sample misspells this key as "langauge".
        language: asString(raw['language']) ?? asString(raw['langauge']) ?? PLAIN_LANGUAGE,
        value: asString(raw['value']) ?? '',
      };
    default:
      return { kind, id, value: asString(raw['value']) ?? '' };
  }
}

function asElementKind(value: unknown): CurriculumPressElement['kind'] | undefined {
  return typeof value === 'string' && (ELEMENT_KINDS as readonly string[]).includes(value)
    ? (value as CurriculumPressElement['kind'])
    : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}
