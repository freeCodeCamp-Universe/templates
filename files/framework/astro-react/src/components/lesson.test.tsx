import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import type { Lesson as LessonDefinition } from '../lib/curriculum-types.js';
import { Lesson } from './lesson.js';

const lesson: LessonDefinition = {
  title: 'A test lesson',
  content: [
    {
      type: 'task',
      task: {
        type: 'multiple-choice',
        question: 'Which option is correct?',
        options: [
          { text: 'Correct option', correct: true },
          { text: 'Wrong option', correct: false },
        ],
      },
    },
  ],
};

describe(Lesson, () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists completion after the task is passed', async () => {
    const user = userEvent.setup();
    render(
      <Lesson
        lesson={lesson}
        lessonSlug="a-test-lesson"
        nextHref="/learn/next-lesson"
        isLastLesson={false}
      />,
    );

    await user.click(screen.getByRole('radio', { name: 'Correct option' }));
    await user.click(screen.getByRole('button', { name: 'Check answer' }));
    const nextLesson = screen.getByRole('link', { name: 'Next lesson' });
    nextLesson.addEventListener('click', (event) => event.preventDefault());
    await user.click(nextLesson);

    expect(localStorage.getItem('progress')).toBe('["a-test-lesson"]');
  });
});
