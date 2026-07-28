import './sidebar.css';
import type { Curriculum } from '../lib/curriculum-types';
import { useSidebarOpen } from '../hooks/use-sidebar-open';
import { CurriculumMap } from './curriculum-map';

type SidebarProps = {
  curriculum: Curriculum;
};

export function Sidebar({ curriculum }: SidebarProps) {
  const open = useSidebarOpen();

  return (
    <div className={open ? 'sidebar' : 'sidebar closed'}>
      <div className="sidebar-inner">
        <CurriculumMap curriculum={curriculum} />
      </div>
    </div>
  );
}
