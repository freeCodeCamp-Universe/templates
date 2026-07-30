import './curriculum-map.css';
import type { CurriculumNav } from '../lib/curriculum-types';
import { buildLearnPath } from '../lib/curriculum-route-utils';

type CurriculumMapProps = {
  curriculum: CurriculumNav;
};

export function CurriculumMap({ curriculum }: CurriculumMapProps) {
  return (
    <nav aria-label="Curriculum sections" className="navigation">
      {curriculum.sections.map((section) => (
        <section key={section.title} className="section">
          <h2>{section.title}</h2>

          {section.modules.map((module) => (
            <div key={module.title} className="module-block">
              <h3>{module.title}</h3>
              <ul className="list">
                {module.lessons.map((lesson) => (
                  <li key={lesson.title} className="item">
                    <a href={buildLearnPath(section.title, module.title, lesson.id)}>
                      {lesson.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </nav>
  );
}
