import { getEntry } from 'astro:content';
import { parseCurriculum } from './parse-curriculum';

export const DEFAULT_CURRICULUM_ENTRY = 'english';

export async function loadCurriculum(entryId: string = DEFAULT_CURRICULUM_ENTRY) {
  const entry = await getEntry('curriculum', entryId);
  const markdown = entry?.body ?? '';
  const title = entry?.data.title ?? 'Untitled Curriculum';
  return parseCurriculum(markdown, title);
}
