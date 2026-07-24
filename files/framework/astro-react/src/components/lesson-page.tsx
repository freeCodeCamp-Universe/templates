import './lesson-page.css';
import type { Lesson, Module, Section } from '../lib/curriculum-types';

type LessonPageProps = {
  section: Section;
  module: Module;
  lesson: Lesson;
};

export function LessonPage({ section, module, lesson }: LessonPageProps) {
  return (
    <main className="page">
      <p><a href="/learn">← Back to Learn</a></p>

      <section className="card">
        <p>{section.title}</p>
        <p>{module.title}</p>
        <h1>{lesson.title}</h1>
        <p>{lesson.text}</p>

        {lesson.task ? (
          <section>
            <h2>Task</h2>
            <pre className="pre">{lesson.task}</pre>
          </section>
        ) : null}

        <p>
          <a href="/learn" className="link">
            Back to Learn
          </a>
        </p>
      </section>
    </main>
  );
}
