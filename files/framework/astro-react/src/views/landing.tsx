import './views.css';
import './landing.css';

type LandingProps = {
  title: string;
};

export function Landing({ title }: LandingProps) {
  return (
    <main id="main-content" className="main" tabIndex={-1}>
      <header className="header">
        <h1>{title}</h1>
      </header>

      <p>
        <a href="/learn">Go to Learn</a>
      </p>
    </main>
  );
}
