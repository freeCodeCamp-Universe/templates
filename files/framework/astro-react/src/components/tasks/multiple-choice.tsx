import './task.css';
import './option-task.css';
import { useId, useState } from 'react';
import { taskPassed } from '../../stores/lesson-store';
import { Markdown } from '../markdown';
import { TaskActions, type Result } from './task-actions';

const FEEDBACK_MESSAGES: Record<Result, string> = {
  correct: 'Correct!',
  incorrect: 'Not quite. Try again.',
  unanswered: 'Select an option first.',
};

type MultipleChoiceProps = {
  question: string;
  options: { text: string; correct: boolean }[];
};

export function MultipleChoice({ question, options }: MultipleChoiceProps) {
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

    const isCorrect = options[selectedIndex].correct;
    setResult(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      taskPassed();
    }
  }

  return (
    <div className="task">
      <fieldset className="fieldset" aria-labelledby={`${groupId}-question`}>
        <div id={`${groupId}-question`} className="question">
          <Markdown>{question}</Markdown>
        </div>

        {options.map((option, index) => {
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

      <TaskActions
        result={result}
        message={result ? FEEDBACK_MESSAGES[result] : ''}
        onCheck={handleCheck}
      />
    </div>
  );
}
