import './task.css';
import './categorize.css';
import { useEffect, useId, useState } from 'react';
import type { Task } from '../../lib/curriculum-tasks';
import { Markdown } from '../markdown';
import { Button } from '../button';
import { useFocusOnCorrect } from '../../hooks/use-focus-on-correct';
import { TaskActions, type Result } from './task-actions';

const UNPLACED = null;

const FEEDBACK_MESSAGES: Record<Result, string> = {
  correct: 'Correct!',
  incorrect: 'Not quite. Try again.',
  unanswered: 'Place all items before checking.',
};

type CategorizeProps = {
  task: Extract<Task, { type: 'categorize' }>;
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

export function Categorize({ task, onCorrect }: CategorizeProps) {
  const groupId = useId();

  const allItems = task.categories.flatMap((category) =>
    category.items.map((item) => ({ item, correctCategory: category.name })),
  );

  const [order, setOrder] = useState(() => allItems.map((entry) => entry.item));
  const [placements, setPlacements] = useState<Record<string, string | null>>(() =>
    Object.fromEntries(allItems.map((entry) => [entry.item, UNPLACED])),
  );
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    // Shuffle after hydration, not during initial render, so the server-rendered
    // and client-rendered order match and there's no hydration mismatch.
    setOrder(shuffle(allItems.map((entry) => entry.item)));
  }, []);

  function handleSelectItem(item: string) {
    setSelectedItem((current) => (current === item ? null : item));
  }

  function handlePlace(categoryName: string | null) {
    if (!selectedItem) {
      setAnnouncement('Select an item first.');
      return;
    }

    setPlacements((current) => ({ ...current, [selectedItem]: categoryName }));
    setAnnouncement(
      categoryName
        ? `${selectedItem} moved to ${categoryName}.`
        : `${selectedItem} moved back to the unplaced items.`,
    );
    setSelectedItem(null);
    setResult(null);
  }

  function handleReset() {
    setPlacements(Object.fromEntries(allItems.map((entry) => [entry.item, UNPLACED])));
    setSelectedItem(null);
    setResult(null);
    setAnnouncement('All items reset.');
  }

  function handleCheck() {
    const allPlaced = order.every((item) => placements[item] !== UNPLACED);
    if (!allPlaced) {
      setResult('unanswered');
      return;
    }

    const correctByItem = Object.fromEntries(allItems.map((entry) => [entry.item, entry.correctCategory]));
    const allCorrect = order.every((item) => placements[item] === correctByItem[item]);
    setResult(allCorrect ? 'correct' : 'incorrect');
    if (allCorrect) {
      onCorrect();
    }
  }

  const unplacedItems = order.filter((item) => placements[item] === UNPLACED);
  const feedbackId = `${groupId}-feedback`;
  const taskRef = useFocusOnCorrect<HTMLDivElement>(result);

  return (
    <div className="task" ref={taskRef} tabIndex={-1}>
      <div className="question">
        <Markdown>{task.question}</Markdown>
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <div className="categorize">
        <div className="zone" role="group" aria-label="Items">
          <h4 className="zone-heading">Items</h4>
          <div className="zone-items">
            {unplacedItems.map((item) => (
              <button
                key={item}
                type="button"
                className={selectedItem === item ? 'item-row selected' : 'item-row'}
                aria-pressed={selectedItem === item}
                disabled={result === 'correct'}
                onClick={() => handleSelectItem(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <button
            type="button"
            className={selectedItem ? 'zone-drop active' : 'zone-drop'}
            aria-label="Move selected item back to the unplaced items"
            disabled={result === 'correct'}
            onClick={() => handlePlace(UNPLACED)}
          />
        </div>

        <div className="categorize-categories">
          {task.categories.map((category) => (
            <div key={category.name} className="zone" role="group" aria-label={category.name}>
              <h4 className="zone-heading">{category.name}</h4>
              <div className="zone-items">
                {order
                  .filter((item) => placements[item] === category.name)
                  .map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={selectedItem === item ? 'item-row selected' : 'item-row'}
                      aria-pressed={selectedItem === item}
                      disabled={result === 'correct'}
                      onClick={() => handleSelectItem(item)}
                    >
                      {item}
                    </button>
                  ))}
              </div>
              <button
                type="button"
                className={selectedItem ? 'zone-drop active' : 'zone-drop'}
                aria-label={`Move selected item to ${category.name}`}
                disabled={result === 'correct'}
                onClick={() => handlePlace(category.name)}
              />
            </div>
          ))}
        </div>
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
