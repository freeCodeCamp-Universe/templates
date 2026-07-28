import './task.css';
import './fill-in-the-blank.css';
import { useState } from 'react';
import type { Task } from '../../lib/curriculum-tasks';
import { Button } from '../button';

type Result = 'correct' | 'incorrect' | 'unanswered';

const FEEDBACK_MESSAGES: Record<Result, string> = {
  correct: 'Correct!',
  incorrect: 'Not quite. Try again.',
  unanswered: 'Fill in every blank first.',
};

type FillInTheBlankProps = {
  task: Extract<Task, { type: 'fill-in-the-blank' }>;
  onCorrect: () => void;
};

export function FillInTheBlank({ task, onCorrect }: FillInTheBlankProps) {
  const blankCount = task.segments.filter((segment) => segment.kind === 'blank').length;
  const [answers, setAnswers] = useState<string[]>(() => Array(blankCount).fill(''));
  const [result, setResult] = useState<Result | null>(null);

  function handleChange(blankIndex: number, value: string) {
    setAnswers((previous) =>
      previous.map((answer, index) => (index === blankIndex ? value : answer)),
    );
    setResult(null);
  }

  function handleCheck() {
    if (answers.some((answer) => answer.trim() === '')) {
      setResult('unanswered');
      return;
    }

    let blankIndex = 0;
    const isCorrect = task.segments.every((segment) => {
      if (segment.kind !== 'blank') {
        return true;
      }

      const userAnswer = answers[blankIndex].trim().toLowerCase();
      const expected = segment.answer.trim().toLowerCase();
      blankIndex += 1;
      return userAnswer === expected;
    });

    setResult(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      onCorrect();
    }
  }

  let blankIndex = 0;

  return (
    <div className="task">
      <p className="prompt">
        {task.segments.map((segment, index) => {
          if (segment.kind === 'text') {
            return <span key={index}>{segment.value}</span>;
          }

          const currentBlankIndex = blankIndex;
          blankIndex += 1;

          return (
            <input
              key={index}
              type="text"
              className="blank"
              aria-label={`Blank ${currentBlankIndex + 1}`}
              value={answers[currentBlankIndex]}
              onChange={(event) => handleChange(currentBlankIndex, event.target.value)}
            />
          );
        })}
      </p>

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
