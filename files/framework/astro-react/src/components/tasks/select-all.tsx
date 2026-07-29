import './task.css';
import './option-task.css';
import { useId, useState } from 'react';
import type { Task } from '../../lib/curriculum-tasks';
import { Markdown } from '../markdown';
import { TaskActions, type Result } from './task-actions';

const FEEDBACK_MESSAGES: Record<Result, string> = {
  correct: 'Correct!',
  incorrect: 'Not quite. Try again.',
  unanswered: 'Select at least one option first.',
};

type SelectAllProps = {
  task: Extract<Task, { type: 'select-all-that-apply' }>;
  nextHref: string;
  isLastLesson: boolean;
};

export function SelectAll({ task, nextHref, isLastLesson }: SelectAllProps) {
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
    <div className="task">
      <fieldset className="fieldset" aria-labelledby={`${groupId}-question`}>
        <div id={`${groupId}-question`} className="question">
          <Markdown>{task.question}</Markdown>
        </div>

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

      <TaskActions
        result={result}
        message={result ? FEEDBACK_MESSAGES[result] : ''}
        onCheck={handleCheck}
        nextHref={nextHref}
        nextLabel={isLastLesson ? 'Finish' : 'Next lesson'}
      />
    </div>
  );
}
