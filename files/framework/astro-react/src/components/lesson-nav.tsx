import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $passedCount, initLesson } from '../stores/lesson-store';
import { markLessonComplete } from '../lib/curriculum-progress';
import { Button } from './button';

type LessonNavProps = {
  taskCount: number;
  lessonSlug: string;
  nextHref: string;
  isLastLesson: boolean;
};

export function LessonNav({ taskCount, lessonSlug, nextHref, isLastLesson }: LessonNavProps) {
  useEffect(() => {
    initLesson(taskCount);
  }, [taskCount]);

  const passedCount = useStore($passedCount);
  const canProceed = passedCount >= taskCount;

  if (!canProceed) return <></>;

  return (
    <div className="lesson-next">
      <Button variant="primary" href={nextHref} onClick={() => markLessonComplete(lessonSlug)}>
        {isLastLesson ? 'Finish' : 'Next lesson'}
      </Button>
    </div>
  );
}
