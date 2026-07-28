import { useEffect, useState } from 'react';

const SIDEBAR_TOGGLE_EVENT = 'sidebar-toggle';

export function toggleSidebar(): void {
  window.dispatchEvent(new CustomEvent(SIDEBAR_TOGGLE_EVENT));
}

export function useSidebarOpen(initialOpen = true): boolean {
  const [open, setOpen] = useState(initialOpen);

  useEffect(() => {
    function handleToggle() {
      setOpen((isOpen) => !isOpen);
    }

    window.addEventListener(SIDEBAR_TOGGLE_EVENT, handleToggle);
    return () => window.removeEventListener(SIDEBAR_TOGGLE_EVENT, handleToggle);
  }, []);

  return open;
}
