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

  it('shows the next lesson based on stored completion', () => {
    render(<Progress lessons={lessons} />);

    const continueLink = screen.getByRole('link', { name: 'Continue learning' });

    expect(continueLink.getAttribute('href')).toBe('/learn/next-lesson');
  });
});
