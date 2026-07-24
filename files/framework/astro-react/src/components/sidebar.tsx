import './sidebar.css';
import { useEffect, useState } from 'react';
import type { Curriculum } from '../lib/curriculum-types';
import { onSidebarToggle } from '../lib/sidebar';
import { LearnNavigation } from './learn-navigation';

type SidebarProps = {
  curriculum: Curriculum;
};

export function Sidebar({ curriculum }: SidebarProps) {
  const [open, setOpen] = useState(true);

  useEffect(() => onSidebarToggle(() => setOpen((isOpen) => !isOpen)), []);

  return (
    <div className={open ? 'sidebar' : 'sidebar closed'}>
      <div className="sidebarInner">
        <LearnNavigation curriculum={curriculum} />
      </div>
    </div>
  );
}
