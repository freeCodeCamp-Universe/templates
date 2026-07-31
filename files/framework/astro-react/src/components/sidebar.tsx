import './sidebar.css';
import type { CurriculumOutline } from '../lib/curriculum-outline';
import { useSidebarOpen } from '../hooks/use-sidebar-open';
import { CurriculumMap } from './curriculum-map';

type SidebarProps = {
  curriculum: CurriculumOutline;
  currentLessonSlug?: string;
};

export function Sidebar({ curriculum, currentLessonSlug }: SidebarProps) {
  const open = useSidebarOpen();

  return (
    <div className={open ? 'sidebar' : 'sidebar closed'}>
      <div className="sidebar-inner">
        <CurriculumMap curriculum={curriculum} currentLessonSlug={currentLessonSlug} />
      </div>
    </div>
  );
}
