import type { Curriculum } from '../lib/curriculum-types';
import { CurriculumMap } from '../components/curriculum-map';

import './views.css';
import './learn.css';

type LearnPageProps = {
  curriculum: Curriculum;
};

export function Learn({ curriculum }: LearnPageProps) {
  return (
    <main id="main-content" className="main" tabIndex={-1}>
      <header className="header">
        <p className="eyebrow">Learn</p>
        <h1>{curriculum.title}</h1>
      </header>

      <CurriculumMap curriculum={curriculum} />
    </main>
  );
}
