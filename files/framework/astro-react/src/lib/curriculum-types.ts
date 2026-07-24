export interface Lesson {
  title: string;
  text: string;
  task: string | null;
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
