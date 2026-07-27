import './lesson-page.css';
import type { Lesson, Module, Section } from '../lib/curriculum-types';
import { Markdown } from './markdown';
import { MultipleChoice } from './multiple-choice';
import { SelectAll } from './select-all';

type LessonPageProps = {
  section: Section;
  module: Module;
  lesson: Lesson;
};

export function LessonPage({ section, module, lesson }: LessonPageProps) {
  return (
    <main id="main-content" className="page" tabIndex={-1}>
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
  );
}
