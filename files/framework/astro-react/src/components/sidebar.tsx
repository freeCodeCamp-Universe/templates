import './sidebar.css';
import type { CurriculumOutline } from '../lib/curriculum-outline';
import { useSidebarOpen } from '../hooks/use-sidebar-open';
import { CurriculumMap } from './curriculum-map';

type SidebarProps = {
  curriculum: CurriculumOutline;
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
