export type CurriculumNav = {
  title: string;
  sections: {
    title: string;
    modules: {
      title: string;
      lessons: { title: string; id: string }[];
    }[];
  }[];
};
