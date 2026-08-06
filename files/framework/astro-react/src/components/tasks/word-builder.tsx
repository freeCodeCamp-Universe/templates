import './task.css';
import './word-builder.css';
import { useEffect, useId, useState } from 'react';
import type { Task } from '../../lib/curriculum-tasks';
import { Markdown } from '../markdown';
import { Button } from '../button';
import { useFocusOnCorrect } from '../../hooks/use-focus-on-correct';
import { TaskActions, type Result } from './task-actions';

const FEEDBACK_MESSAGES: Record<Result, string> = {
  correct: 'Correct!',
  incorrect: 'Not quite. Try again.',
  unanswered: 'Add at least one tile before checking.',
};

type WordBuilderProps = {
  task: Extract<Task, { type: 'word-builder' }>;
  onCorrect: () => void;
};

type Tile = { id: number; text: string };

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function WordBuilder({ task, onCorrect }: WordBuilderProps) {
  const groupId = useId();
  const questionId = `${groupId}-question`;
  const feedbackId = `${groupId}-feedback`;

  const tiles: Tile[] = task.tiles.map((text, id) => ({ id, text }));

  const [poolIds, setPoolIds] = useState<number[]>(() => tiles.map((tile) => tile.id));
  const [answerIds, setAnswerIds] = useState<number[]>([]);
  const [shuffled, setShuffled] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    setPoolIds(shuffle(tiles.map((tile) => tile.id)));
    setShuffled(true);
  }, []);

  function tileText(id: number): string {
    return tiles[id].text;
  }

  function handleAdd(id: number) {
    setAnswerIds((current) => [...current, id]);
    setPoolIds((current) => current.filter((tileId) => tileId !== id));
    setAnnouncement(`${tileText(id)} added. Position ${answerIds.length + 1}.`);
    setResult(null);
  }

  function handleRemove(id: number) {
    setAnswerIds((current) => current.filter((tileId) => tileId !== id));
    setPoolIds((current) => [...current, id]);
    setAnnouncement(`${tileText(id)} removed.`);
    setResult(null);
  }

  function handleReset() {
    setPoolIds((current) => shuffle([...current, ...answerIds]));
    setAnswerIds([]);
    setAnnouncement('Answer cleared.');
    setResult(null);
  }

  function handleCheck() {
    if (answerIds.length === 0) {
      setResult('unanswered');
      return;
    }

    const built = answerIds.map(tileText);
    const isCorrect =
      built.length === task.answer.length &&
      built.every((part, index) => part === task.answer[index]);
    setResult(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      onCorrect();
    }
  }

  const taskRef = useFocusOnCorrect<HTMLDivElement>(result);
  const disabled = result === 'correct';

  return (
    <div className="task" ref={taskRef} tabIndex={-1}>
      <div id={questionId} className="question">
        <Markdown>{task.prompt}</Markdown>
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <div className="word-builder-answer" role="group" aria-labelledby={questionId}>
        <h4 className="zone-heading">Your answer</h4>
        <div className={shuffled ? 'word-builder-row' : 'word-builder-row unshuffled'}>
          {answerIds.length === 0 ? (
            <span className="word-builder-placeholder">No tiles added yet.</span>
          ) : (
            answerIds.map((id, index) => (
              <button
                key={`${id}-${index}`}
                type="button"
                className="tile tile-placed"
                disabled={disabled}
                onClick={() => handleRemove(id)}
                aria-label={`Remove ${tileText(id)} from position ${index + 1}`}
              >
                {tileText(id)}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="word-builder-pool" role="group" aria-label="Available tiles">
        <div className={shuffled ? 'word-builder-row' : 'word-builder-row unshuffled'}>
          {poolIds.map((id) => (
            <button
              key={id}
              type="button"
              className="tile"
              disabled={disabled}
              onClick={() => handleAdd(id)}
              aria-label={`Add ${tileText(id)}`}
            >
              {tileText(id)}
            </button>
          ))}
        </div>
      </div>

      <TaskActions
        result={result}
        message={result ? FEEDBACK_MESSAGES[result] : ''}
        onCheck={handleCheck}
        feedbackId={feedbackId}
        secondaryAction={
          result !== 'correct' && answerIds.length > 0 ? (
            <Button variant="secondary" onClick={handleReset}>
              Reset
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}
