import type { CurriculumNav, Lesson } from '../lib/curriculum-types';
import { Markdown } from '../components/markdown';
import { Sidebar } from '../components/sidebar';
import { Button } from '../components/button';
import { MultipleChoice } from '../components/tasks/multiple-choice';
import { SelectAll } from '../components/tasks/select-all';
import { FillInTheBlank } from '../components/tasks/fill-in-the-blank';

import './views.css';
import './lesson.css';

type LessonProps = {
  curriculum: CurriculumNav;
  lesson: Lesson;
  nextHref: string;
  isLastLesson: boolean;
};

export function Lesson({ curriculum, lesson, nextHref, isLastLesson }: LessonProps) {
  const nextLabel = isLastLesson ? 'Finish' : 'Next lesson';

  return (
    <div className="lesson-layout">
      <Sidebar curriculum={curriculum} />

      <main id="main-content" className="main" tabIndex={-1}>
        <section>
          <h1>{lesson.title}</h1>
          <Markdown>{lesson.text}</Markdown>

          {lesson.task && lesson.task.type === 'multiple-choice' ? (
            <MultipleChoice task={lesson.task} nextHref={nextHref} isLastLesson={isLastLesson} />
          ) : null}

          {lesson.task && lesson.task.type === 'select-all-that-apply' ? (
            <SelectAll task={lesson.task} nextHref={nextHref} isLastLesson={isLastLesson} />
          ) : null}

          {lesson.task && lesson.task.type === 'fill-in-the-blank' ? (
            <FillInTheBlank task={lesson.task} nextHref={nextHref} isLastLesson={isLastLesson} />
          ) : null}

          {!lesson.task ? (
            <div className="lesson-next">
              <Button variant="primary" href={nextHref}>
                {nextLabel}
              </Button>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
