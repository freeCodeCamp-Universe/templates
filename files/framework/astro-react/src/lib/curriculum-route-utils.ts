export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function buildLessonRouteSlug(
  section: string,
  module: string,
  lesson: string,
): string {
  return [slugify(section), slugify(module), slugify(lesson)].join('-');
}

export function buildLearnPath(section: string, module: string, lesson: string): string {
  return `/learn/${buildLessonRouteSlug(section, module, lesson)}`;
}
