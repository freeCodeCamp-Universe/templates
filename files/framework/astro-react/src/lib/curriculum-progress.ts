const PROGRESS_STORAGE_KEY = 'progress';

export function markLessonComplete(slug: string): void {
  let current: string[] = [];

  try {
    const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    if (Array.isArray(parsed)) {
      current = parsed;
    }
  } catch {
    current = [];
  }

  if (current.includes(slug)) {
    return;
  }

  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify([...current, slug]));
}
