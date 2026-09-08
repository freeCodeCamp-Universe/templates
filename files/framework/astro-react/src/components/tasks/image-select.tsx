import './task.css';
import './image-select.css';
import { useEffect, useId, useRef, useState } from 'react';
import type { Task } from '../../lib/curriculum-tasks';
import { Markdown } from '../markdown';
import { Button } from '../button';
import { useFocusOnCorrect } from '../../hooks/use-focus-on-correct';
import { TaskActions, type Result } from './task-actions';

const FEEDBACK_MESSAGES: Record<Result, string> = {
  correct: 'Correct!',
  incorrect: 'Not quite. Try again.',
  unanswered: 'Select at least one region first.',
};

const INTERACTIVE_TAGS = new Set(['path', 'polygon', 'polyline', 'circle', 'ellipse', 'rect', 'g']);

function getRegionIds(svgText: string): string[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, 'image/svg+xml');
  return Array.from(doc.documentElement.querySelectorAll('[id]'))
    .filter((el) => INTERACTIVE_TAGS.has(el.tagName.toLowerCase()))
    .map((el) => el.id)
    .filter(Boolean);
}

type ImageSelectProps = {
  task: Extract<Task, { type: 'image-select' }>;
  onCorrect: () => void;
};

export function ImageSelect({ task, onCorrect }: ImageSelectProps) {
  const groupId = useId();
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);
  const [regionIds, setRegionIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const taskRef = useFocusOnCorrect<HTMLDivElement>(result);

  const isAnswered = result === 'correct';
  const tabStopId = focusedId ?? regionIds[0] ?? null;

  useEffect(() => {
    fetch(task.imageSrc)
      .then((r) => r.text())
      .then((text) => {
        const markup = text.replace(/<\?xml[^?]*\?>\s*/g, '');
        const ids = getRegionIds(markup);
        setSvgMarkup(markup);
        setRegionIds(ids);
        setFocusedId(ids[0] ?? null);
      });
  }, [task.imageSrc]);

  // Sync accessibility attributes and visual state onto SVG elements
  useEffect(() => {
    if (!containerRef.current || !regionIds.length) return;

    for (const id of regionIds) {
      const el = containerRef.current.querySelector(`[id="${id}"]`);
      if (!el) continue;

      el.setAttribute('role', 'checkbox');
      el.setAttribute('aria-label', el.getAttribute('data-label') ?? id);
      el.setAttribute('aria-checked', String(selected.has(id)));

      if (isAnswered) {
        el.setAttribute('aria-disabled', 'true');
      } else {
        el.removeAttribute('aria-disabled');
      }

      el.classList.toggle('region-focused', id === tabStopId && !isAnswered);
      el.classList.toggle('region-selected', selected.has(id) && !isAnswered);
      el.classList.toggle('region-correct', selected.has(id) && isAnswered);
    }
  }, [regionIds, selected, tabStopId, isAnswered]);

  function toggleRegion(id: string) {
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    setResult(null);
  }

  function handleContainerClick(event: React.MouseEvent) {
    if (isAnswered) return;
    let el: Element | null = event.target as Element;
    while (el && el !== containerRef.current) {
      if (el.id && regionIds.includes(el.id)) {
        toggleRegion(el.id);
        setFocusedId(el.id);
        return;
      }
      el = el.parentElement;
    }
  }

  function handleContainerKeyDown(event: React.KeyboardEvent) {
    const index = tabStopId ? regionIds.indexOf(tabStopId) : -1;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      setFocusedId(regionIds[Math.min(index + 1, regionIds.length - 1)]);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      setFocusedId(regionIds[Math.max(index - 1, 0)]);
    } else if (event.key === ' ' && tabStopId && !isAnswered) {
      event.preventDefault();
      toggleRegion(tabStopId);
    }
  }

  function handleCheck() {
    if (selected.size === 0) {
      setResult('unanswered');
      return;
    }
    const correctSet = new Set(task.correct);
    const isCorrect =
      task.correct.every((id) => selected.has(id)) &&
      [...selected].every((id) => correctSet.has(id));
    setResult(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) onCorrect();
  }

  function handleReset() {
    setSelected(new Set());
    setResult(null);
  }

  const feedbackId = `${groupId}-feedback`;
  const promptId = `${groupId}-prompt`;

  return (
    <div className="task" ref={taskRef} tabIndex={-1}>
      <div id={promptId} className="image-select-prompt">
        <Markdown>{task.prompt}</Markdown>
      </div>

      {svgMarkup === null ? (
        <div className="image-select-loading" aria-busy="true" />
      ) : (
        // SVG files are authored by content authors and served from /public.
        // dangerouslySetInnerHTML is acceptable here since we control the source.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <div
          ref={containerRef}
          className="image-select-container"
          role="group"
          aria-labelledby={promptId}
          aria-describedby={result ? feedbackId : undefined}
          aria-activedescendant={!isAnswered && tabStopId ? tabStopId : undefined}
          tabIndex={isAnswered ? -1 : 0}
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
          onClick={handleContainerClick}
          onKeyDown={handleContainerKeyDown}
        />
      )}

      <TaskActions
        result={result}
        message={result ? FEEDBACK_MESSAGES[result] : ''}
        onCheck={handleCheck}
        feedbackId={feedbackId}
        secondaryAction={
          !isAnswered ? (
            <Button variant="secondary" onClick={handleReset}>
              Reset
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}
