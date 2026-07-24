import './learn.css';
import type { Curriculum } from '../lib/curriculum-types';
import { LearnNavigation } from './learn-navigation';

type LearnPageProps = {
  curriculum: Curriculum;
};

export function Learn({ curriculum }: LearnPageProps) {
  return (
    <main id="main-content" className="page" tabIndex={-1}>
      <header className="header">
        <p className="eyebrow">Learn</p>
        <h1>{curriculum.title}</h1>
      </header>

      <LearnNavigation curriculum={curriculum} />
    </main>
  );
}
