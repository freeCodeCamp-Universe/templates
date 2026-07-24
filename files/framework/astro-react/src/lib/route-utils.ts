import type { Lesson, Module, Section } from './curriculum-types';

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function buildLessonRouteSlug(
  section: Section | string,
  module: Module | string,
  lesson: Lesson | string,
): string {
  const sectionSlug = typeof section === 'string' ? slugify(section) : slugify(section.title);
  const moduleSlug = typeof module === 'string' ? slugify(module) : slugify(module.title);
  const lessonSlug = typeof lesson === 'string' ? slugify(lesson) : slugify(lesson.title);

  return [sectionSlug, moduleSlug, lessonSlug].join('-');
}

export function buildLearnPath(section: Section | string, module: Module | string, lesson: Lesson | string): string {
  return `/learn/${buildLessonRouteSlug(section, module, lesson)}`;
}
