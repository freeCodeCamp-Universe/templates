import './option-task.css';
import { useId, useState } from 'react';
import type { Task } from '../lib/tasks';
import { Button } from './button';

type Result = 'correct' | 'incorrect' | 'unanswered';

const FEEDBACK_MESSAGES: Record<Result, string> = {
  correct: 'Correct!',
  incorrect: 'Not quite. Try again.',
  unanswered: 'Select at least one option first.',
};

type SelectAllProps = {
  task: Task;
};

export function SelectAll({ task }: SelectAllProps) {
  const groupId = useId();
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [result, setResult] = useState<Result | null>(null);

  function handleToggle(index: number) {
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
    setResult(null);
  }

  function handleCheck() {
    if (selected.size === 0) {
      setResult('unanswered');
      return;
    }

    const isCorrect = task.options.every((option, index) => option.correct === selected.has(index));
    setResult(isCorrect ? 'correct' : 'incorrect');
  }

  return (
    <div className="optionTask">
      <fieldset className="fieldset">
        <legend className="legend">{task.question}</legend>

        {task.options.map((option, index) => {
          const optionId = `${groupId}-${index}`;

          return (
            <div key={index} className="option">
              <input
                type="checkbox"
                id={optionId}
                checked={selected.has(index)}
                onChange={() => handleToggle(index)}
              />
              <label htmlFor={optionId}>{option.text}</label>
            </div>
          );
        })}
      </fieldset>

      <Button variant="primary" onClick={handleCheck}>
        Check answer
      </Button>

      <p className={`feedback ${result ?? ''}`} role="status" aria-live="polite">
        {result ? FEEDBACK_MESSAGES[result] : ''}
      </p>
    </div>
  );
}
