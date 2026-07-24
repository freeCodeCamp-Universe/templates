import './landing.css';
import type { Curriculum } from '../lib/curriculum-types';

type LandingProps = {
  curriculum: Curriculum;
};

export function Landing({ curriculum }: LandingProps) {
  return (
    <main className="page">
      <header className="header">
        <h1>{curriculum.title}</h1>
      </header>

      <p>
        <a href="/learn">Go to Learn</a>
      </p>
    </main>
  );
}
