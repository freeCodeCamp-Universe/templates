import './task.css';
import './option-task.css';
import { useId, useState } from 'react';
import { taskPassed } from '../../stores/lesson-store';
import { Markdown } from '../markdown';
import { useFocusOnCorrect } from '../../hooks/use-focus-on-correct';
import { TaskActions, type Result } from './task-actions';

const FEEDBACK_MESSAGES: Record<Result, string> = {
  correct: 'Correct!',
  incorrect: 'Not quite. Try again.',
  unanswered: 'Select at least one option first.',
};

type SelectAllProps = {
  question: string;
  options: { text: string; correct: boolean }[];
};

export function SelectAll({ question, options }: SelectAllProps) {
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

    const isCorrect = options.every((option, index) => option.correct === selected.has(index));
    setResult(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      taskPassed();
    }
  }

  const feedbackId = `${groupId}-feedback`;
  const invalid = result === 'incorrect' || result === 'unanswered';
  const taskRef = useFocusOnCorrect<HTMLDivElement>(result);

  return (
    <div className="task" ref={taskRef} tabIndex={-1}>
      <fieldset
        className="fieldset"
        aria-labelledby={`${groupId}-question`}
        aria-invalid={invalid || undefined}
        aria-describedby={result ? feedbackId : undefined}
      >
        <div id={`${groupId}-question`} className="question">
          <Markdown>{question}</Markdown>
        </div>

        {options.map((option, index) => (
          <label key={index} className="option">
            <input
              type="checkbox"
              checked={selected.has(index)}
              onChange={() => handleToggle(index)}
              disabled={result === 'correct'}
              aria-invalid={invalid || undefined}
              aria-describedby={result ? feedbackId : undefined}
            />
            {option.text}
          </label>
        ))}
      </fieldset>

      <TaskActions
        result={result}
        message={result ? FEEDBACK_MESSAGES[result] : ''}
        onCheck={handleCheck}
        feedbackId={feedbackId}
      />
    </div>
  );
}
