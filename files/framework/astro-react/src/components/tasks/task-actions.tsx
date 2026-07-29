import './task.css';
import { Button } from '../button';

export type Result = 'correct' | 'incorrect' | 'unanswered';

type TaskActionsProps = {
  result: Result | null;
  message: string;
  onCheck: () => void;
};

export function TaskActions({ result, message, onCheck }: TaskActionsProps) {
  return (
    <div className="task-actions">
      <p className={`feedback ${result ?? ''}`} role="status" aria-live="polite">
        {message}
      </p>

      {result !== 'correct' ? (
        <Button variant="primary" onClick={onCheck}>
          Check answer
        </Button>
      ) : null}
    </div>
  );
}
