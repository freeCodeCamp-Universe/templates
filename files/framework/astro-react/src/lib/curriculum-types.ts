import type { Task } from './curriculum-tasks';

export type LessonContentBlock = { type: 'text'; markdown: string } | { type: 'task'; task: Task };

export type Lesson = {
  title: string;
  content: LessonContentBlock[];
};

export type Module = {
  title: string;
  lessons: Lesson[];
};

export type Section = {
  title: string;
  modules: Module[];
};

export type Curriculum = {
  title: string;
  sections: Section[];
};

export type CurriculumNav = {
  title: string;
  sections: {
    title: string;
    modules: {
      title: string;
      lessons: { title: string }[];
    }[];
  }[];
};
