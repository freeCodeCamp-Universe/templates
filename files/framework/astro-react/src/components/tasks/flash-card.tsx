import './task.css';
import './flash-card.css';
import { type KeyboardEvent, useId, useState } from 'react';
import type { Task } from '../../lib/curriculum-tasks';
import { useFocusOnCorrect } from '../../hooks/use-focus-on-correct';
import { Button } from '../button';
import { Markdown } from '../markdown';
import { TaskActions, type Result } from './task-actions';

const FEEDBACK_MESSAGES: Record<Result, string> = {
  correct: 'Complete!',
  incorrect: 'Flip the card first.',
  unanswered: 'Flip the card first.',
};

type FlashCardProps = {
  task: Extract<Task, { type: 'flash-card' }>;
  onCorrect: () => void;
};

export function FlashCard({ task, onCorrect }: FlashCardProps) {
  const cardId = useId();
  const [flipped, setFlipped] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const taskRef = useFocusOnCorrect<HTMLDivElement>(result);

  function handleFlip() {
    if (result === 'correct') {
      return;
    }

    setFlipped((current) => !current);
    setResult(null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    handleFlip();
  }

  function handleReset() {
    setFlipped(false);
    setResult(null);
  }

  function handleCheck() {
    if (!flipped) {
      setResult('unanswered');
      return;
    }

    setResult('correct');
    onCorrect();
  }

  const feedbackId = `${cardId}-feedback`;
  const frontId = `${cardId}-front`;
  const backId = `${cardId}-back`;
  const activeFaceId = flipped ? backId : frontId;

  return (
    <div className="task" ref={taskRef} tabIndex={-1}>
      <div className="flash-card-scene">
        <div
          className={flipped ? 'flash-card flipped' : 'flash-card'}
          role="button"
          tabIndex={result === 'correct' ? -1 : 0}
          aria-labelledby={activeFaceId}
          aria-describedby={feedbackId}
          aria-pressed={flipped}
          aria-disabled={result === 'correct' || undefined}
          onClick={handleFlip}
          onKeyDown={handleKeyDown}
        >
          <div className="flash-card-inner">
            <div className="flash-card-face flash-card-front" aria-hidden={flipped || undefined}>
              <div id={frontId} className="flash-card-content">
                <Markdown>{task.front}</Markdown>
              </div>
              <p className="flash-card-hint">Tap to reveal</p>
            </div>

            <div className="flash-card-face flash-card-back" aria-hidden={!flipped || undefined}>
              <div id={backId} className="flash-card-content">
                <Markdown>{task.back}</Markdown>
              </div>
              <p className="flash-card-hint">Tap to show front</p>
            </div>
          </div>
        </div>
      </div>

      <TaskActions
        result={result}
        message={result ? FEEDBACK_MESSAGES[result] : ''}
        onCheck={handleCheck}
        feedbackId={feedbackId}
        secondaryAction={
          result !== 'correct' ? (
            <Button variant="secondary" onClick={handleReset} disabled={!flipped}>
              Reset
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}
