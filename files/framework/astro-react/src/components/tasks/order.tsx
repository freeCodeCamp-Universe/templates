import './task.css';
import './order.css';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { Task } from '../../lib/curriculum-tasks';
import { Markdown } from '../markdown';
import { Button } from '../button';
import { useFocusOnCorrect } from '../../hooks/use-focus-on-correct';
import { TaskActions, type Result } from './task-actions';

const FEEDBACK_MESSAGES: Record<Result, string> = {
  correct: 'Correct!',
  incorrect: 'Not quite. Try again.',
  unanswered: 'Order the items first.',
};

type OrderProps = {
  task: Extract<Task, { type: 'order' }>;
  onCorrect: () => void;
};

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function Order({ task, onCorrect }: OrderProps) {
  const groupId = useId();
  const questionId = `${groupId}-question`;
  const feedbackId = `${groupId}-feedback`;

  const [items, setItems] = useState<string[]>(() => task.items);
  const [initialOrder, setInitialOrder] = useState<string[]>(() => task.items);
  const [shuffled, setShuffled] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [result, setResult] = useState<Result | null>(null);

  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const previousRects = useRef<Record<string, DOMRect> | null>(null);

  function captureRowPositions() {
    const rects: Record<string, DOMRect> = {};
    for (const item of items) {
      const node = rowRefs.current[item];
      if (node) {
        rects[item] = node.getBoundingClientRect();
      }
    }
    previousRects.current = rects;
  }

  // FLIP animation: rows keep the same key when they swap, so React moves the
  // existing DOM nodes rather than re-mounting them. Without this, the swap
  // happens between one paint and the next with no visible motion to follow.
  useLayoutEffect(() => {
    const previous = previousRects.current;
    if (!previous) {
      return;
    }

    for (const item of items) {
      const node = rowRefs.current[item];
      const previousRect = previous[item];
      if (!node || !previousRect) {
        continue;
      }

      const deltaY = previousRect.top - node.getBoundingClientRect().top;
      if (deltaY === 0) {
        continue;
      }

      node.style.transition = 'none';
      node.style.transform = `translateY(${deltaY}px)`;

      requestAnimationFrame(() => {
        node.style.transition = 'transform 150ms ease';
        node.style.transform = '';
      });
    }

    previousRects.current = null;
  }, [items]);

  useEffect(() => {
    // Shuffle after hydration, not during initial render, so the server-rendered
    // and client-rendered order match and there's no hydration mismatch. Items
    // stay hidden (see the `unshuffled` class below) until this runs.
    const shuffledItems = shuffle(task.items);
    setItems(shuffledItems);
    setInitialOrder(shuffledItems);
    setShuffled(true);
  }, []);

  function handleMove(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) {
      return;
    }

    captureRowPositions();
    const next = [...items];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    setItems(next);
    setResult(null);
    setAnnouncement(
      `${items[index]} moved ${direction === -1 ? 'up' : 'down'}. Now position ${targetIndex + 1} of ${items.length}.`,
    );
  }

  function handleReset() {
    captureRowPositions();
    setItems([...initialOrder]);
    setResult(null);
    setAnnouncement('Order reset.');
  }

  function handleCheck() {
    const isCorrect = items.every((item, index) => item === task.items[index]);
    setResult(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      onCorrect();
    }
  }

  const taskRef = useFocusOnCorrect<HTMLDivElement>(result);

  return (
    <div className="task" ref={taskRef} tabIndex={-1}>
      <div id={questionId} className="question">
        <Markdown>{task.question}</Markdown>
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <div
        className={shuffled ? 'order-list' : 'order-list unshuffled'}
        role="group"
        aria-labelledby={questionId}
      >
        {items.map((item, index) => (
          <div
            key={item}
            className="order-row"
            ref={(node) => {
              rowRefs.current[item] = node;
            }}
          >
            <span className="order-position">{index + 1}.</span>
            <span className="order-text">{item}</span>
            <div className="order-controls">
              <button
                type="button"
                className="btn btn-secondary"
                aria-label={`Move ${item} up`}
                disabled={index === 0 || result === 'correct'}
                onClick={() => handleMove(index, -1)}
              >
                Up
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                aria-label={`Move ${item} down`}
                disabled={index === items.length - 1 || result === 'correct'}
                onClick={() => handleMove(index, 1)}
              >
                Down
              </button>
            </div>
          </div>
        ))}
      </div>

      <TaskActions
        result={result}
        message={result ? FEEDBACK_MESSAGES[result] : ''}
        onCheck={handleCheck}
        feedbackId={feedbackId}
        secondaryAction={
          result !== 'correct' ? (
            <Button variant="secondary" onClick={handleReset}>
              Reset
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}
