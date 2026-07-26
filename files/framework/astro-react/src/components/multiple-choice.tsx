import './multiple-choice.css';
import { useId, useState } from 'react';
import type { Task } from '../lib/tasks';
import { Button } from './button';

type Result = 'correct' | 'incorrect' | 'unanswered';

const FEEDBACK_MESSAGES: Record<Result, string> = {
  correct: 'Correct!',
  incorrect: 'Not quite. Try again.',
  unanswered: 'Select an option first.',
};

type MultipleChoiceProps = {
  task: Task;
};

export function MultipleChoice({ task }: MultipleChoiceProps) {
  const groupName = useId();
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

    setResult(task.options[selectedIndex].correct ? 'correct' : 'incorrect');
  }

  return (
    <div className="multipleChoice">
      <fieldset className="fieldset">
        <legend className="legend">{task.question}</legend>

        {task.options.map((option, index) => {
          const optionId = `${groupName}-${index}`;

          return (
            <div key={index} className="option">
              <input
                type="radio"
                id={optionId}
                name={groupName}
                checked={selectedIndex === index}
                onChange={() => handleSelect(index)}
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
