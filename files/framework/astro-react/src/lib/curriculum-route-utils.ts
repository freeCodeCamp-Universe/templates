import type { CurriculumNav } from './curriculum-types';

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function buildLessonRouteSlug(section: string, module: string, lessonId: string): string {
  return [slugify(section), slugify(module), slugify(lessonId)].join('-');
}

export function buildLearnPath(section: string, module: string, lessonId: string): string {
  return `/learn/${buildLessonRouteSlug(section, module, lessonId)}`;
}

export type OrderedLessonEntry = {
  section: CurriculumNav['sections'][number];
  module: CurriculumNav['sections'][number]['modules'][number];
  lesson: CurriculumNav['sections'][number]['modules'][number]['lessons'][number];
  slug: string;
  href: string;
};

export function getOrderedLessons(curriculum: CurriculumNav): OrderedLessonEntry[] {
  return curriculum.sections.flatMap((section) =>
    section.modules.flatMap((module) =>
      module.lessons.map((lesson) => ({
        section,
        module,
        lesson,
        slug: buildLessonRouteSlug(section.title, module.title, lesson.id),
        href: buildLearnPath(section.title, module.title, lesson.id),
      })),
    ),
  );
}
