import './learn-navigation.css';
import type { Curriculum } from '../lib/curriculum-types';
import { buildLearnPath } from '../lib/route-utils';

type LearnNavigationProps = {
  curriculum: Curriculum;
};

export function LearnNavigation({ curriculum }: LearnNavigationProps) {
  return (
    <nav aria-label="Curriculum sections" className="navigation">
      {curriculum.sections.map((section) => (
        <section key={section.title} className="sectionCard">
          <h2>{section.title}</h2>

          {section.modules.map((module) => (
            <div key={module.title} className="moduleBlock">
              <h3>{module.title}</h3>
              <ul className="list">
                {module.lessons.map((lesson) => (
                  <li key={lesson.title} className="item">
                    <a href={buildLearnPath(section, module, lesson)} className="link">
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
