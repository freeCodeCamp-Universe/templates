import './task.css';
import './fill-in-the-blank.css';
import { useState } from 'react';
import { taskPassed } from '../../stores/lesson-store';
import { TaskActions, type Result } from './task-actions';

const FEEDBACK_MESSAGES: Record<Result, string> = {
  correct: 'Correct!',
  incorrect: 'Not quite. Try again.',
  unanswered: 'Fill in every blank first.',
};

type Segment = { kind: 'text'; value: string } | { kind: 'blank'; answer: string };

type FillInTheBlankProps = {
  segments: Segment[];
};

export function FillInTheBlank({ segments }: FillInTheBlankProps) {
  const blankCount = segments.filter((segment) => segment.kind === 'blank').length;
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
    const isCorrect = segments.every((segment) => {
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
      taskPassed();
    }
  }

  let blankIndex = 0;

  return (
    <div className="task">
      <p className="prompt">
        {segments.map((segment, index) => {
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

      <TaskActions
        result={result}
        message={result ? FEEDBACK_MESSAGES[result] : ''}
        onCheck={handleCheck}
      />
    </div>
  );
}
