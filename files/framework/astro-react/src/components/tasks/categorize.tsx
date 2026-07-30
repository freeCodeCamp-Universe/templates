import './task.css';
import './categorize.css';
import { useEffect, useId, useState } from 'react';
import { taskPassed } from '../../stores/lesson-store';
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
  question: string;
  categories: { name: string; items: string[] }[];
};

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

type ZoneProps = {
  label: string;
  dropLabel: string;
  items: string[];
  selectedItem: string | null;
  disabled: boolean;
  onSelectItem: (item: string) => void;
  onDrop: () => void;
};

function Zone({
  label,
  dropLabel,
  items,
  selectedItem,
  disabled,
  onSelectItem,
  onDrop,
}: ZoneProps) {
  // A zone isn't a valid drop target for an item that's already in it.
  const canDrop = selectedItem !== null && !items.includes(selectedItem);

  return (
    <div className="zone" role="group" aria-label={label}>
      <h4 className="zone-heading">{label}</h4>
      <div className="zone-items">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            className={selectedItem === item ? 'item-row selected' : 'item-row'}
            aria-pressed={selectedItem === item}
            disabled={disabled}
            onClick={() => onSelectItem(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <button
        type="button"
        className={canDrop ? 'zone-drop active' : 'zone-drop'}
        aria-label={dropLabel}
        disabled={disabled || !canDrop}
        onClick={onDrop}
      />
    </div>
  );
}

export function Categorize({ question, categories }: CategorizeProps) {
  const groupId = useId();

  const allItems = categories.flatMap((category) =>
    category.items.map((item) => ({ item, correctCategory: category.name })),
  );

  const [order, setOrder] = useState(() => allItems.map((entry) => entry.item));
  const [placements, setPlacements] = useState<Record<string, string | null>>(() =>
    Object.fromEntries(allItems.map((entry) => [entry.item, UNPLACED])),
  );
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [shuffled, setShuffled] = useState(false);

  useEffect(() => {
    setOrder(shuffle(allItems.map((entry) => entry.item)));
    setShuffled(true);
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

    const correctByItem = Object.fromEntries(
      allItems.map((entry) => [entry.item, entry.correctCategory]),
    );
    const allCorrect = order.every((item) => placements[item] === correctByItem[item]);
    setResult(allCorrect ? 'correct' : 'incorrect');
    if (allCorrect) {
      taskPassed();
    }
  }

  const unplacedItems = order.filter((item) => placements[item] === UNPLACED);
  const feedbackId = `${groupId}-feedback`;
  const taskRef = useFocusOnCorrect<HTMLDivElement>(result);

  return (
    <div className="task" ref={taskRef} tabIndex={-1}>
      <div className="question">
        <Markdown>{question}</Markdown>
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <div className={shuffled ? 'categorize' : 'categorize unshuffled'}>
        <Zone
          label="Items"
          dropLabel="Move selected item back to the unplaced items"
          items={unplacedItems}
          selectedItem={selectedItem}
          disabled={result === 'correct'}
          onSelectItem={handleSelectItem}
          onDrop={() => handlePlace(UNPLACED)}
        />

        <div className="categorize-categories">
          {categories.map((category) => (
            <Zone
              key={category.name}
              label={category.name}
              dropLabel={`Move selected item to ${category.name}`}
              items={order.filter((item) => placements[item] === category.name)}
              selectedItem={selectedItem}
              disabled={result === 'correct'}
              onSelectItem={handleSelectItem}
              onDrop={() => handlePlace(category.name)}
            />
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
