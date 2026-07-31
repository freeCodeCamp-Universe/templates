import './curriculum-map.css';
import type { CurriculumOutline } from '../lib/curriculum-outline';
import { buildLearnPath, buildLessonRouteSlug } from '../lib/curriculum-route-utils';

type CurriculumMapProps = {
  curriculum: CurriculumOutline;
  currentLessonSlug?: string;
};

export function CurriculumMap({ curriculum, currentLessonSlug }: CurriculumMapProps) {
  return (
    <nav aria-label="Curriculum sections" className="navigation">
      {curriculum.sections.map((section) => (
        <section key={section.title} className="section">
          <h2>{section.title}</h2>

          {section.modules.map((module) => (
            <div key={module.title} className="module-block">
              <h3>{module.title}</h3>
              <ul className="list">
                {module.lessons.map((lesson) => {
                  const slug = buildLessonRouteSlug(section.title, module.title, lesson.title);
                  const isCurrent = slug === currentLessonSlug;

                  return (
                    <li key={lesson.title} className={isCurrent ? 'item current' : 'item'}>
                      <a
                        href={buildLearnPath(section.title, module.title, lesson.title)}
                        aria-current={isCurrent ? 'page' : undefined}
                      >
                        {lesson.title}
                      </a>
                      <span className="completed-badge" data-lesson-slug={slug}>
                        <span aria-hidden="true">✓</span>
                        <span className="sr-only"> Completed</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </nav>
  );
}
