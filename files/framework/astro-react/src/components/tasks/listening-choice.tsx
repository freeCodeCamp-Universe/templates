import './task.css';
import './option-task.css';
import './listening-choice.css';
import { useId, useRef, useState } from 'react';
import type { Task } from '../../lib/curriculum-tasks';
import { Button } from '../button';
import { useFocusOnCorrect } from '../../hooks/use-focus-on-correct';
import { TaskActions, type Result } from './task-actions';

const FEEDBACK_MESSAGES: Record<Result, string> = {
  correct: 'Correct!',
  incorrect: 'Not quite. Try again.',
  unanswered: 'Select an option first.',
};

type ListeningChoiceProps = {
  task: Extract<Task, { type: 'listening-choice' }>;
  onCorrect: () => void;
};

function speak(text: string) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.85;
  window.speechSynthesis.speak(utterance);
}

export function ListeningChoice({ task, onCorrect }: ListeningChoiceProps) {
  const groupId = useId();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [transcriptShown, setTranscriptShown] = useState(false);
  const speechSupported = useRef(
    typeof window !== 'undefined' && 'speechSynthesis' in window,
  ).current;

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
    setTranscriptShown(true);
    if (isCorrect) {
      onCorrect();
    }
  }

  const feedbackId = `${groupId}-feedback`;
  const invalid = result === 'incorrect' || result === 'unanswered';
  const showTranscript = transcriptShown || !speechSupported;
  const taskRef = useFocusOnCorrect<HTMLDivElement>(result);

  return (
    <div className="task" ref={taskRef} tabIndex={-1}>
      <div className="listening-controls">
        {speechSupported ? (
          <Button variant="secondary" onClick={() => speak(task.audioText)}>
            Play audio
          </Button>
        ) : null}
        <Button variant="link" onClick={() => setTranscriptShown(true)} disabled={showTranscript}>
          Show transcript
        </Button>
      </div>

      <p className="listening-transcript" aria-live="polite">
        {showTranscript ? task.audioText : 'Transcript hidden. Listen, then choose an answer.'}
      </p>

      <fieldset
        className="fieldset"
        aria-labelledby={`${groupId}-question`}
        aria-invalid={invalid || undefined}
        aria-describedby={result ? feedbackId : undefined}
      >
        <div id={`${groupId}-question`} className="question">
          Choose the best meaning.
        </div>

        {task.options.map((option, index) => (
          <label key={index} className="option">
            <input
              type="radio"
              name={groupId}
              checked={selectedIndex === index}
              onChange={() => handleSelect(index)}
              disabled={result === 'correct'}
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
