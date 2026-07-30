import './task.css';
import './match-pairs.css';
import { useMemo, useState } from 'react';
import { taskPassed } from '../../stores/lesson-store';
import { TaskActions, type Result } from './task-actions';

const FEEDBACK_MESSAGES: Record<Result, string> = {
  correct: 'Correct!',
  incorrect: 'Not quite. Try again.',
  unanswered: 'Match all pairs first.',
};

type MatchPairsProps = {
  pairs: { left: string; right: string }[];
};

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function MatchPairs({ pairs }: MatchPairsProps) {
  // shuffledRightIndices[displayPos] = original pair index
  const shuffledRightIndices = useMemo(() => shuffle(pairs.map((_, i) => i)), [pairs]);

  const [selected, setSelected] = useState<{ side: 'left' | 'right'; index: number } | null>(null);
  // matches: left index → shuffled right display position
  const [matches, setMatches] = useState<Map<number, number>>(new Map());
  const [result, setResult] = useState<Result | null>(null);

  // Reverse lookup: shuffled right display position → left index
  const rightToLeft = useMemo(() => {
    const map = new Map<number, number>();
    for (const [l, r] of matches) map.set(r, l);
    return map;
  }, [matches]);

  function getMatchNumber(leftIndex: number): number | null {
    if (!matches.has(leftIndex)) return null;
    let n = 0;
    for (let i = 0; i <= leftIndex; i++) {
      if (matches.has(i)) n++;
    }
    return n;
  }

  function handleClick(side: 'left' | 'right', index: number) {
    if (result === 'correct') return;
    setResult(null);

    const isLeftMatched = side === 'left' && matches.has(index);
    const isRightMatched = side === 'right' && rightToLeft.has(index);

    // Clicking a matched item unmatches it
    if (isLeftMatched) {
      setMatches((prev) => {
        const next = new Map(prev);
        next.delete(index);
        return next;
      });
      setSelected(null);
      return;
    }
    if (isRightMatched) {
      const leftIdx = rightToLeft.get(index)!;
      setMatches((prev) => {
        const next = new Map(prev);
        next.delete(leftIdx);
        return next;
      });
      setSelected(null);
      return;
    }

    // Nothing selected yet — select this item
    if (selected === null) {
      setSelected({ side, index });
      return;
    }

    // Same side — switch selection
    if (selected.side === side) {
      setSelected({ side, index });
      return;
    }

    // Different sides — create a pair
    const leftIdx = side === 'left' ? index : selected.index;
    const rightIdx = side === 'right' ? index : selected.index;

    setMatches((prev) => {
      const next = new Map(prev);
      next.set(leftIdx, rightIdx);
      return next;
    });
    setSelected(null);
  }

  function handleCheck() {
    if (matches.size < pairs.length) {
      setResult('unanswered');
      return;
    }

    const isCorrect = [...matches.entries()].every(
      ([leftIdx, displayPos]) => shuffledRightIndices[displayPos] === leftIdx,
    );

    setResult(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      taskPassed();
    }
  }

  return (
    <div className="task">
      <div className="match-pairs">
        <div className="match-column">
          {pairs.map((pair, i) => {
            const isSelected = selected?.side === 'left' && selected.index === i;
            const matchNum = getMatchNumber(i);
            return (
              <button
                key={i}
                type="button"
                className={`match-item ${isSelected ? 'selected' : ''} ${matchNum !== null ? 'matched' : ''}`}
                onClick={() => handleClick('left', i)}
              >
                {matchNum !== null && <span className="match-badge">{matchNum}</span>}
                {pair.left}
              </button>
            );
          })}
        </div>
        <div className="match-column">
          {shuffledRightIndices.map((originalIdx, displayPos) => {
            const isSelected = selected?.side === 'right' && selected.index === displayPos;
            const leftIdx = rightToLeft.get(displayPos);
            const matchNum = leftIdx !== undefined ? getMatchNumber(leftIdx) : null;
            return (
              <button
                key={displayPos}
                type="button"
                className={`match-item ${isSelected ? 'selected' : ''} ${matchNum !== null ? 'matched' : ''}`}
                onClick={() => handleClick('right', displayPos)}
              >
                {matchNum !== null && <span className="match-badge">{matchNum}</span>}
                {pairs[originalIdx].right}
              </button>
            );
          })}
        </div>
      </div>
      <TaskActions
        result={result}
        message={result ? FEEDBACK_MESSAGES[result] : ''}
        onCheck={handleCheck}
      />
    </div>
  );
}
