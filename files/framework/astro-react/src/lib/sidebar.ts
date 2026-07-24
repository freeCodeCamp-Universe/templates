const SIDEBAR_TOGGLE_EVENT = 'sidebar-toggle';

export function toggleSidebar(): void {
  window.dispatchEvent(new CustomEvent(SIDEBAR_TOGGLE_EVENT));
}

export function onSidebarToggle(callback: () => void): () => void {
  window.addEventListener(SIDEBAR_TOGGLE_EVENT, callback);
  return () => window.removeEventListener(SIDEBAR_TOGGLE_EVENT, callback);
}
