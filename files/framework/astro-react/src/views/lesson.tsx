import type { Curriculum, Lesson } from '../lib/curriculum-types';
import { Markdown } from '../components/markdown';
import { Sidebar } from '../components/sidebar';
import { MultipleChoice } from '../components/tasks/multiple-choice';
import { SelectAll } from '../components/tasks/select-all';
import { FillInTheBlank } from '../components/tasks/fill-in-the-blank';

import './views.css';
import './lesson.css';

type LessonProps = {
  curriculum: Curriculum;
  lesson: Lesson;
};

export function Lesson({ curriculum, lesson }: LessonProps) {
  return (
    <div className="lesson-layout">
      <Sidebar curriculum={curriculum} />

      <main id="main-content" className="main" tabIndex={-1}>
        <section>
          <h1>{lesson.title}</h1>
          <Markdown>{lesson.text}</Markdown>

          {lesson.task && lesson.task.type === 'multiple-choice' ? (
            <section>
              <h2>Task</h2>
              <MultipleChoice task={lesson.task} />
            </section>
          ) : null}

          {lesson.task && lesson.task.type === 'select-all-that-apply' ? (
            <section>
              <h2>Task</h2>
              <SelectAll task={lesson.task} />
            </section>
          ) : null}

          {lesson.task && lesson.task.type === 'fill-in-the-blank' ? (
            <section>
              <h2>Task</h2>
              <FillInTheBlank task={lesson.task} />
            </section>
          ) : null}
        </section>
      </main>
    </div>
  );
}
