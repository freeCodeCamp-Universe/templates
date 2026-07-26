import './lesson-page.css';
import type { Lesson, Module, Section } from '../lib/curriculum-types';
import { MultipleChoice } from './multiple-choice';

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
        <p>{lesson.text}</p>

        {lesson.task && lesson.task.type === 'multiple-choice' ? (
          <section>
            <h2>Task</h2>
            <MultipleChoice task={lesson.task} />
          </section>
        ) : null}

        <p>
          <a href="/learn">Back to Learn</a>
        </p>
      </section>
    </main>
  );
}
