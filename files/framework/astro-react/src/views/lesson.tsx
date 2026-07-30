import { useState } from 'react';
import type { Lesson } from '../lib/curriculum-types';
import { Markdown } from '../components/markdown';
import { Button } from '../components/button';
import { MultipleChoice } from '../components/tasks/multiple-choice';
import { SelectAll } from '../components/tasks/select-all';
import { FillInTheBlank } from '../components/tasks/fill-in-the-blank';
import { useSidebarOpen } from '../hooks/use-sidebar-open';
import { markLessonComplete } from '../lib/curriculum-progress';

import './views.css';
import './lesson.css';

type LessonProps = {
  lesson: Lesson;
  lessonSlug: string;
  nextHref: string;
  isLastLesson: boolean;
};

export function Lesson({ lesson, lessonSlug, nextHref, isLastLesson }: LessonProps) {
  const taskCount = lesson.content.filter((block) => block.type === 'task').length;
  const [passedCount, setPassedCount] = useState(0);
  const canProceed = passedCount >= taskCount;
  const sidebarOpen = useSidebarOpen();

  function handleTaskPassed() {
    setPassedCount((count) => count + 1);
  }

  return (
    <main
      id="main-content"
      className={sidebarOpen ? 'main sidebar-open' : 'main'}
      tabIndex={-1}
    >
      <section>
        <h1>{lesson.title}</h1>

        {lesson.content.map((block, index) => {
          if (block.type === 'text') {
            return <Markdown key={index}>{block.markdown}</Markdown>;
          }

          if (block.task.type === 'multiple-choice') {
            return <MultipleChoice key={index} task={block.task} onCorrect={handleTaskPassed} />;
          }

          if (block.task.type === 'select-all-that-apply') {
            return <SelectAll key={index} task={block.task} onCorrect={handleTaskPassed} />;
          }

          return <FillInTheBlank key={index} task={block.task} onCorrect={handleTaskPassed} />;
        })}

        {canProceed ? (
          <div className="lesson-next">
            <Button variant="primary" href={nextHref} onClick={() => markLessonComplete(lessonSlug)}>
              {isLastLesson ? 'Finish' : 'Next lesson'}
            </Button>
          </div>
        ) : null}
      </section>
    </main>
  );
}
