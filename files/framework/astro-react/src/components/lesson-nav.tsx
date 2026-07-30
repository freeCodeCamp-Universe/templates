import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $passedCount, initLesson } from '../stores/lesson-store';
import { Button } from './button';

type LessonNavProps = {
  taskCount: number;
  nextHref: string;
  isLastLesson: boolean;
};

export function LessonNav({ taskCount, nextHref, isLastLesson }: LessonNavProps) {
  useEffect(() => {
    initLesson(taskCount);
  }, [taskCount]);

  const passedCount = useStore($passedCount);
  const canProceed = passedCount >= taskCount;

  if (!canProceed) return null;

  return (
    <div className="lesson-next">
      <Button variant="primary" href={nextHref}>
        {isLastLesson ? 'Finish' : 'Next lesson'}
      </Button>
    </div>
  );
}
