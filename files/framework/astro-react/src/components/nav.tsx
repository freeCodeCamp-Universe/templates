import './nav.css';
import { useEffect, useState } from 'react';
import { getStoredTheme, setTheme, type Theme } from '../lib/theme';

type NavProps = {
  brand: string;
};

export function Nav({ brand }: NavProps) {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    setThemeState(getStoredTheme());
  }, []);

  function handleToggleTheme() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    setThemeState(next);
  }

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <nav aria-label="Main" className="nav">
        <a href="/" className="brand">
          {brand}
        </a>

        <div className="navActions">
          <button type="button" className="themeToggle" onClick={handleToggleTheme}>
            {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          </button>

          <a href="/donate" className="donateLink">
            Donate
          </a>
        </div>
      </nav>
    </>
  );
}
