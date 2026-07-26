import type { Task } from './tasks';

export interface Lesson {
  title: string;
  text: string;
  task: Task | null;
}

export interface Module {
  title: string;
  lessons: Lesson[];
}

export interface Section {
  title: string;
  modules: Module[];
}

export interface Curriculum {
  title: string;
  sections: Section[];
}
