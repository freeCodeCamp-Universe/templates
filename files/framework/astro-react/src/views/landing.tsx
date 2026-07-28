import type { Curriculum } from '../lib/curriculum-types';

import './views.css';
import './landing.css';

type LandingProps = {
  curriculum: Curriculum;
};

export function Landing({ curriculum }: LandingProps) {
  return (
    <main id="main-content" className="main" tabIndex={-1}>
      <header className="header">
        <h1>{curriculum.title}</h1>
      </header>

      <p>
        <a href="/learn">Go to Learn</a>
      </p>
    </main>
  );
}
