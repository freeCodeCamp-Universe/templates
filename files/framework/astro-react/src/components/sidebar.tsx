import './sidebar.css';
import { useEffect, useState } from 'react';
import type { Curriculum } from '../lib/curriculum-types';
import { onSidebarToggle } from '../lib/sidebar';
import { CurriculumMap } from './curriculum-map';

type SidebarProps = {
  curriculum: Curriculum;
};

export function Sidebar({ curriculum }: SidebarProps) {
  const [open, setOpen] = useState(true);

  useEffect(() => onSidebarToggle(() => setOpen((isOpen) => !isOpen)), []);

  return (
    <div className={open ? 'sidebar' : 'sidebar closed'}>
      <div className="sidebarInner">
        <CurriculumMap curriculum={curriculum} />
      </div>
    </div>
  );
}
