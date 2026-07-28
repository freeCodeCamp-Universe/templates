import './task.css';
import './option-task.css';
import { useId, useState } from 'react';
import type { Task } from '../../lib/curriculum-tasks';
import { Button } from '../button';
import { Markdown } from '../markdown';

type Result = 'correct' | 'incorrect' | 'unanswered';

const FEEDBACK_MESSAGES: Record<Result, string> = {
  correct: 'Correct!',
  incorrect: 'Not quite. Try again.',
  unanswered: 'Select an option first.',
};

type MultipleChoiceProps = {
  task: Extract<Task, { type: 'multiple-choice' }>;
  onCorrect: () => void;
};

export function MultipleChoice({ task, onCorrect }: MultipleChoiceProps) {
  const groupId = useId();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  function handleSelect(index: number) {
    setSelectedIndex(index);
    setResult(null);
  }

  function handleCheck() {
    if (selectedIndex === null) {
      setResult('unanswered');
      return;
    }

    const isCorrect = task.options[selectedIndex].correct;
    setResult(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      onCorrect();
    }
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
                type="radio"
                id={optionId}
                name={groupId}
                checked={selectedIndex === index}
                onChange={() => handleSelect(index)}
              />
              <label htmlFor={optionId}>{option.text}</label>
            </div>
          );
        })}
      </fieldset>

      {result !== 'correct' ? (
        <Button variant="primary" onClick={handleCheck}>
          Check answer
        </Button>
      ) : null}

      <p className={`feedback ${result ?? ''}`} role="status" aria-live="polite">
        {result ? FEEDBACK_MESSAGES[result] : ''}
      </p>
    </div>
  );
}
