import './nav.css';
import { useEffect, useState } from 'react';
import { getStoredTheme, setTheme, type Theme } from '../lib/theme';
import { toggleSidebar } from '../lib/sidebar';

type NavProps = {
  brand: string;
  showSidebarToggle?: boolean;
};

export function Nav({ brand, showSidebarToggle = false }: NavProps) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setThemeState(getStoredTheme());
  }, []);

  function handleToggleTheme() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    setThemeState(next);
  }

  function handleToggleSidebar() {
    setSidebarOpen((open) => !open);
    toggleSidebar();
  }

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <nav aria-label="Main" className="nav">
        <div className="navStart">
          {showSidebarToggle ? (
            <button
              type="button"
              className="sidebarToggle"
              aria-expanded={sidebarOpen}
              aria-label={sidebarOpen ? 'Hide curriculum sidebar' : 'Show curriculum sidebar'}
              onClick={handleToggleSidebar}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          ) : null}

          <a href="/" className="brand">
            {brand}
          </a>
        </div>

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
