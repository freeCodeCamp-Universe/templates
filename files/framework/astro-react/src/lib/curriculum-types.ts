import type { Task } from './curriculum-tasks';

export type Lesson = {
  title: string;
  text: string;
  task: Task | null;
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
