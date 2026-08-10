# Curriculum Press bridge

Curriculum Press outputs a JSON document that this turns into the same `Curriculum`
structure that `../parse-curriculum.ts` builds from markdown, so both authoring
routes feed identical data into the site.

- `curriculum-template.json` is the lesson skeleton to import into Curriculum Press (Project page, "Import template", paste the file contents).
- `parse-curriculum-press.ts` parses the export back into `Curriculum`.
- `curriculum-press-types.ts` mirrors the export wire format.

## Usage

```ts
import { parseCurriculumPress } from '../lib/curriculum-press';
import project from '../data/my-project.json';

const curriculum = parseCurriculumPress(project, {
  title: 'My Curriculum',
  description: 'Optional description',
});
```

Without `title`, the curriculum title is the exported project name.

## Structure mapping

A Curriculum Press export carries `layout`, an ordered list of
`"<project>/<folder>/.../<lesson>"` paths, index-aligned with `lessons`. Folders
become sections and modules:

| Folder depth | Section       | Module                            |
| ------------ | ------------- | --------------------------------- |
| 2 folders    | first folder  | second folder                     |
| 1 folder     | the folder    | the folder, reused                |
| 0 folders    | project name  | project name                      |
| 3 or more    | first folder  | remaining folders joined by " / " |

So the canonical layout is `project/section/module/lesson`. Order is preserved:
sections, modules and lessons appear in `layout` order, and elements appear in
the author's order within a lesson.

## Element dictionary

Curriculum Press has four generic element kinds; meaning lives in the element
`id` and in the element order. This parser reads them as follows.

| Kind       | Id      | Becomes                                                       |
| ---------- | ------- | ------------------------------------------------------------- |
| `text`     | `title` | the lesson title (falls back to the lesson name when empty)   |
| `text`     | any     | a `text` content block, value used verbatim                    |
| `markdown` | any     | a `text` content block                                         |
| `code`     | any     | a `text` content block holding a fenced block in its language  |
| `json`     | any     | one or more `task` content blocks                              |

Empty elements produce no content block. Element ids other than `title` are free
for the author to choose; they are documentation only, so `intro`, `step-1` and
`text-3` all read the same way.

## Tasks

A `json` element holds one task object, or an array of task objects. Each is
validated by the schemas in `../curriculum-tasks.ts`, the same ones the markdown
parser uses, so an invalid task fails the build with the lesson and element name
in the message. Adding a task type there makes it available here with no change
to this directory.

Task shapes currently accepted:

```json
{
  "type": "multiple-choice",
  "question": "Which keyword declares a constant?",
  "options": [
    { "text": "const", "correct": true },
    { "text": "let", "correct": false }
  ]
}
```

```json
{
  "type": "select-all-that-apply",
  "question": "Which of these are primitives?",
  "options": [
    { "text": "string", "correct": true },
    { "text": "number", "correct": true },
    { "text": "array", "correct": false }
  ]
}
```

```json
{
  "type": "fill-in-the-blank",
  "segments": [
    { "kind": "text", "value": "The " },
    { "kind": "blank", "answer": "return" },
    { "kind": "text", "value": " keyword exits a function." }
  ]
}
```

```json
{
  "type": "categorize",
  "question": "Sort these by language.",
  "categories": [
    { "name": "JavaScript", "items": ["const", "let"] },
    { "name": "Rust", "items": ["fn", "mut"] }
  ]
}
```

```json
{
  "type": "order",
  "question": "Order the request lifecycle.",
  "items": ["Request", "Handler", "Response"]
}
```

## Template

`curriculum-template.json` gives every lesson the same slots: a title, an intro,
one task, and a closing note. Elements are optional at parse time, so a lesson
may leave any of them empty, and an author may add more elements of any kind to
a single lesson without breaking the parser. To change the default lesson shape,
edit the file and re-import it into Curriculum Press.
