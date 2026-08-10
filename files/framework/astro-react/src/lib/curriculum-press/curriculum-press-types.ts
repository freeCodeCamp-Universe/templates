/**
 * The Curriculum Press export format ("wire format"), mirrored here so this
 * template can parse it without depending on Curriculum Press itself.
 *
 * Source of truth: `client/lib/wire.ts` and `client/lib/types.ts` in the
 * Curriculum Press repository. Keep this file in step with them.
 */

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export type CurriculumPressElement =
  | { kind: 'text'; id: string; value: string }
  | { kind: 'markdown'; id: string; value: string }
  | { kind: 'code'; id: string; language: string; value: string }
  | { kind: 'json'; id: string; value: JsonValue };

export type CurriculumPressLesson = {
  id: string;
  name: string;
  elements: CurriculumPressElement[];
};

export type CurriculumPressProject = {
  project_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  /** Depth-first "<project>/<section>/<module>/<lesson>". Index-aligned with `lessons`. */
  layout: string[];
  lessons: CurriculumPressLesson[];
};
