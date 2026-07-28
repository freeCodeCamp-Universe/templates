import { atom } from 'nanostores';
import { useStore } from '@nanostores/react';

const $sidebarOpen = atom(true);

export function toggleSidebar(): void {
  $sidebarOpen.set(!$sidebarOpen.get());
}

export function useSidebarOpen(): boolean {
  return useStore($sidebarOpen);
}
