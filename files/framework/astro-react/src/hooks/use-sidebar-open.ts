import { atom } from 'nanostores';
import { useStore } from '@nanostores/react';

// Must match the breakpoint in sidebar.css's @media (max-width: 600px) block.
const MOBILE_BREAKPOINT = 600;

function getInitialSidebarOpen(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }
  return window.innerWidth > MOBILE_BREAKPOINT;
}

const $sidebarOpen = atom(getInitialSidebarOpen());

export function toggleSidebar(): void {
  $sidebarOpen.set(!$sidebarOpen.get());
}

export function useSidebarOpen(): boolean {
  return useStore($sidebarOpen);
}
