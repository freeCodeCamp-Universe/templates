import type { Curriculum, Lesson, Module, Section } from '../lib/curriculum-types';
import { Markdown } from '../components/markdown';
import { Sidebar } from '../components/sidebar';
import { MultipleChoice } from '../components/tasks/multiple-choice';
import { SelectAll } from '../components/tasks/select-all';

import './views.css';
import './lesson.css';

type LessonProps = {
  curriculum: Curriculum;
  section: Section;
  module: Module;
  lesson: Lesson;
};

export function Lesson({ curriculum, section, module, lesson }: LessonProps) {
  return (
    <div className="lesson-layout">
      <Sidebar curriculum={curriculum} />

      <main id="main-content" className="main" tabIndex={-1}>
        <p>
          <a href="/learn">← Back to Learn</a>
        </p>

        <section className="card">
          <p>{section.title}</p>
          <p>{module.title}</p>
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

          <p>
            <a href="/learn">Back to Learn</a>
          </p>
        </section>
      </main>
    </div>
  );
}
