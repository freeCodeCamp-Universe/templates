import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { Progress } from './progress.js';

const lessons = [
  { slug: 'completed-lesson', href: '/learn/completed-lesson', section: 'Section one' },
  { slug: 'next-lesson', href: '/learn/next-lesson', section: 'Section one' },
];

describe(Progress, () => {
  beforeEach(() => {
    localStorage.setItem('progress', JSON.stringify(['completed-lesson']));
  });

  it('shows stored completion and the next lesson', async () => {
    render(<Progress lessons={lessons} />);

    const progress = await screen.findByRole('progressbar', { name: 'Lesson completion' });
    const continueLink = screen.getByRole('link', { name: 'Continue learning' });

    expect({
      completed: progress.getAttribute('value'),
      total: progress.getAttribute('max'),
      nextHref: continueLink.getAttribute('href'),
    }).toEqual({
      completed: '1',
      total: '2',
      nextHref: '/learn/next-lesson',
    });
  });
});
