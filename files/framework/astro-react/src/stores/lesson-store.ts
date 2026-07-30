import { atom } from 'nanostores';

export const $taskCount = atom(0);
export const $passedCount = atom(0);

export function initLesson(taskCount: number): void {
  $taskCount.set(taskCount);
  $passedCount.set(0);
}

export function taskPassed(): void {
  $passedCount.set($passedCount.get() + 1);
}
