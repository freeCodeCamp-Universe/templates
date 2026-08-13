---
name: curriculum-from-prd
description: Converts a PRD, spec, outline, or any document containing curriculum or course content into a structured curriculum markdown file. Use this whenever a user has a document with educational content to turn into lessons - even if the document does not call itself a curriculum. Triggers on: "convert this PRD to curriculum", "turn this into lessons", "make a curriculum from this", "PRD to curriculum", "convert curriculum", "generate curriculum from this doc", "build lessons from this". When a user pastes a document and asks about curriculum structure, always trigger this skill.
---

# PRD to Curriculum Converter

Converts an input document - PRD, outline, spec, or any structured educational content - into up to two output files:

1. The **curriculum markdown**, following the established schema. Always produced. Write it directly to `src/content/curriculum/english.md`, overwriting the sample content there - that is the live file the site actually loads, so there is no separate staging step.
2. A **new task types file** (`.new-task-types.md` at the repository root) documenting any task types invented during the conversion. Only produced if at least one activity didn't fit an existing type - skip this file entirely otherwise. It is a temporary handoff file for `task-extender`, not permanent content.

---

## Before you start

Read `src/lib/curriculum-tasks.ts` (task type schemas) and find a real usage example of each type in `src/content/curriculum/english.md`. Do this first, not just when mapping activities in Step 3 - knowing what task types actually require shapes how lessons get planned in Step 2, not only how they get mapped later.

---

## Output 1: Curriculum format

Written directly to `src/content/curriculum/english.md`. YAML frontmatter and a hierarchy of Sections -> Modules -> Lessons:

```markdown
---
title: Course Title
description: Optional one-sentence description.
---

# Section Title

## Module Title

### Lesson Title

Lesson prose content (standard markdown).

--task-type--

Task content.

--end-task-type--
```

### Naming conventions

All titles must be concise - a short label, not a phrase or sentence.

- **Sections**: Number at the start or end, matching the PRD's own phrasing if it already numbers divisions. Examples: `Session 1`, `1. Introduction`, `Unit 2`.
- **Modules**: Decimal-numbered per section. Examples: `1.1 Basics`, `2.3 Practice`. Keep to 2-4 words.
- **Lessons**: No numbers. Name after the concept being practiced, not the activity type. Keep to 1-5 words. Examples: `Compound Interest`, `The Renaissance`, `Photosynthesis`. Avoid `Lesson 3: Practice Activity` or `Question 4`.

### Prose content rules

- Be concise. No filler words or padding - use the fewest words that still make the point clearly.
- No em-dashes, right arrows (->), or stylized punctuation. Use plain commas and periods; write like a textbook, not generated text.
  Bad: "Start with the setup - it tells you what happens next."
  Good: "Start with the setup because it tells you what happens next."
- Use backticks for technical terms, formulas, code, or short exact phrases referenced inline (e.g., `H2O`, `binary search`, `iambic pentameter`) in prose, anchors, and task prompts.
- No internal PRD identifiers (item codes, section reference numbers) in the output. Refer to concepts by name.

---

## Granularity rule (important)

**One task per lesson is the default.** Split any multi-item activity (a 5-item exercise, a 6-question quiz, an 8-question review set) into that many lessons, one task each - unless it reads like a final exam, in which case keep it as one lesson.

Exception: a reference table immediately followed by one matching exercise can share a lesson; a table followed by 5 separate questions becomes 1 reference lesson + 5 task lessons.

Name each lesson after its concept, not a generic label - `Photosynthesis`, not `Warm-up Question 1`.

Explanatory text introducing a new concept is its own lesson with no task - not every lesson needs one.

---

## Lesson prose rule (important)

Every lesson needs either prose before the task or a self-contained task prompt - never a bare task block with nothing orienting the learner.

- **First lesson in a module:** one to three sentences establishing the module's purpose.
- **Later lessons:** skip repeated framing - the module title and task prompt carry it. If the task depends on something introduced earlier without redefining it, rewrite the prompt to be self-contained or add a one-sentence anchor.
- **Task prompts must be self-contained:** they should make sense without recalling earlier lessons. Instead of "Solve this using the method from before," write "Solve for x using the substitution method."

---

## Micro-context rule (important)

When a task depends on recalling something specific, add a brief anchor sentence before the task block.

**Add one when:** the task depends on a specific fact not obvious from the lesson itself (e.g., a categorize task testing a role or property, not just meaning).

**Skip it when:**
- Ungraded warm-up items (intentionally context-free).
- Multiple-choice questions where the question itself provides everything needed.
- Categorize tasks where the learner just studied the relevant material - the material is the context and the task tests recall.

**The anchor should name the specific fact, not the topic.** For example, if a categorize task tests which of two words is a noun and which is a verb, the anchor should name the roles: "`cat` is a noun; `run` is a verb." Not "cat means a small animal," which doesn't help classify it.

Example - correct anchor for a categorize task:
```markdown
### cat/run

`cat` is a noun; `run` is a verb.

--categorize--

Label each word.

- Noun
  - cat
- Verb
  - run

--end-categorize--
```

Example - lesson with no anchor needed (question is self-contained):
```markdown
### Boiling Point

--multiple-choice--

At sea level, water boils at approximately what temperature?

- [x] 100°C
- [ ] 50°C
- [ ] 150°C

--end-multiple-choice--
```

---

## Step 1: Identify the PRD section types

Longer PRDs mix several kinds of sections. Identify each section's type before writing anything:

| Section type | Recognizable by | What to do |
|---|---|---|
| **Session / unit content** | Has activities, tasks, practice items | Convert to curriculum modules and lessons |
| **Learner contract / intro text** | Says "display this before session 1" or gives rules of the game | Include as a lesson (or a few lessons) in the first module of the first session. Keep "display verbatim" text as blockquote prose. |
| **Notation or reference tables** | Tables of syntax, symbols, or vocabulary with no practice | Include as a lesson (no task) if the learner needs to read it |
| **Session map / schedule** | A table of sessions with timing and themes | Omit. Use it to understand flow and topic ordering, but do not include it in the curriculum |
| **Outcomes / objectives** | Bullet lists of what the learner will be able to do | Omit |
| **Product thesis / research** | Context for why the product exists, research citations | Omit |
| **Mastery levels table** | Explains how progress is tracked | Omit unless the PRD explicitly says to show it to learners |
| **Wrap-up / transition text** | Closing or transitional remarks between sections | Include as closing prose on the last lesson of a section if it orients the learner; omit if purely structural |

Anything not covered above (a glossary, a reference deck, worked examples) gets the same treatment as any section: decide if each entry is prose or practice, and apply the same rules. Don't invent a special-cased path for it.

---

## Step 2: Plan the structure before writing

Sketch the structure first. For each activity, count the items and plan that many lessons:

- Is this activity one concept explained, or a set of practice items?
- If it is a set of items, each item is a lesson.
- What is the best lesson title for each item (the concept, not the activity)?
- Which lessons need a task and which are just reading?
- Which lessons need a micro-context anchor? What should it say?

---

## Task content rule

**Every task block must contain a task** - a question, instruction, or prompt telling the learner what to do. Answer options alone, or content with no action, are not enough.

Check the real fields each type requires (see Existing task types below) rather than assuming. Whatever the type, tell the learner what to do - don't just show material.

If the PRD gives items but no instruction, write a clear one - a specific question beats a bare list of options.

**List every spelling a blank should accept.** `fill-in-the-blank` compares the learner's text against each accepted answer after trimming and lowercasing, and nothing else. There is no fuzzy matching, so any form you do not list is marked wrong.

Separate alternatives with `|`. A blank whose value can be written more than one way must list each one:

- Numbers with both a numeral and a word: `{{thirteen|13}}`.
- Values carrying a unit or symbol: `{{5 K|5 kelvin}}`, `{{50%|50 percent}}`.
- Names with an optional article or particle: `{{the Air Board|Air Board}}`.

Write the alternatives in the order a learner is most likely to type them. A single-answer blank like `{{Jervis}}` needs no pipe.

The check is still exact, so this is not a licence to blank something vague. Prefer a proper noun, a year, or a term the lesson wrote out verbatim, and use alternatives for the cases where a correct learner could reasonably type something else.

**Never blank a value that contains a pipe.** The `|` is always a separator, so any pipe inside a blank splits it into alternatives. This is silent: the build succeeds, and the learner who types the whole correct answer is marked wrong while someone typing only the fragment before the pipe is marked right.

This bites hardest on code, where `|` is ordinary syntax:

| Written as | Actually parsed as |
|---|---|
| `{{string \| number}}` | two answers, `string` and `number` |
| `{{cat file \| grep foo}}` | two answers, `cat file` and `grep foo` |
| `{{^(cat\|dog)$}}` | two answers, `^(cat` and `dog)$` |
| `{{x \|\| y}}` | two answers, `x` and `y` |

Backticks do not protect it. `` {{`x || y`}} `` splits exactly the same way, because the blank is read from the text after markdown is parsed.

So before writing any blank, check whether the answer contains a pipe. TypeScript unions, shell pipelines, regex alternation, logical `OR`, and markdown table rows all do. When the answer contains one, do not blank it. Blank a different part of the line, or rewrite the sentence so the pipe sits in the surrounding text and the blank holds something else.

The only safe exception is a blank made of nothing but pipes, which is read literally: `{{|}}` asks for `|`, and `{{||}}` asks for `||`. Use that to test the operator itself. Anything mixing a pipe with other characters splits.

**Vary the correct answer's position.** Don't default to listing the correct option(s) first - that's a systematic tell, not a random one. Across the curriculum, correct answers should land in different positions from lesson to lesson where applicable.

---

## Step 3: Map activities to task types

### Existing task types

Don't hardcode a list of task types here - it will drift the moment `task-extender` adds one. Discover what exists before mapping anything:

1. Read `src/lib/curriculum-tasks.ts` for the authoritative list of task type names (each is a `type: z.literal('...')`) and their required fields.
2. Find a real usage example of each type in `src/content/curriculum/english.md` (or any other file under `src/content/curriculum/`) to see the actual `--marker--` / `--end-marker--` markdown syntax in practice, since the schema describes parsed structure, not raw markdown.

Match each activity by what the learner does (one correct answer, several correct answers, filling a blank, sorting items, ordering steps) and what they need to be shown, not by surface wording. If nothing matches on either count, see New task types below - don't force a fit.

**Don't sort a single item into categories** - that's a multiple-choice question with the categories as options. Categorize needs several items distributed across categories.

### New task types (placeholder syntax)

For activities that don't fit an existing type, invent a sensible kebab-case name and write markdown fields that fit what the learner is doing. Document it in `.new-task-types.md` (Output 2), following its format exactly.

**The fit test has two parts: what the learner does, and what they need to be shown.**

- **Mechanic:** does an existing type ask the learner to do the literal same thing, just described differently? Consider it as an option. Does fitting the activity in require *you* to pre-build wrong answers, discard distractors, drop an assembly or ordering step, or flatten a multi-step interaction into one pick? That's a different mechanic - invent a new type.
- **Presentation:** check the real component in `src/components/tasks/`, not just the schema. Does the slot the activity needs (question, options, items) need something new? A slot that can't show what's needed, likely needs a new type - even if the mechanic is otherwise identical.

A missing capability (no current component can show or play it) is not a missing asset (a specific file - a real recording, a real photo - the PRD doesn't supply and this skill can't create). The first is always in scope: build the type. Before treating something as a missing asset, check whether a browser-native capability can stand in without any pre-supplied file. Only defer if no such stand-in exists.

Apply both parts of the test per activity. A single PRD may need one new type, several, or none - don't assume the count in either direction.

**Consistency rule:** for a repeat occurrence of any task type, existing or invented, copy the exact structural skeleton (markers, field order, blank-line placement) of your last correct instance instead of rewriting the syntax from memory. This is about structure, not content - it does not mean reusing the same correct-answer position; see Vary the correct answer's position above.

---

## Step 4: Quality checklist

Before finalizing, verify:

- [ ] YAML frontmatter with `title`
- [ ] Sections use numbered titles
- [ ] Every module has a decimal number (1.1, 1.2, not just 1, 2)
- [ ] Lesson titles have no leading or trailing numbers
- [ ] Section, module, and lesson titles are all concise (lessons: 1-5 words)
- [ ] Lesson prose is concise, with no filler words or padding
- [ ] Every lesson has either prose before the task or a self-contained task prompt
- [ ] Every fill-in-the-blank answer with more than one valid written form lists its alternatives with `|`
- [ ] No fill-in-the-blank answer contains a pipe as part of its own value (unions, shell pipelines, regex alternation, logical `OR`), since it would silently split
- [ ] Task prompts do not depend on something from an earlier lesson without redefining it
- [ ] Most lessons have exactly one task block
- [ ] No em-dashes or arrows in prose
- [ ] No internal PRD identifiers (item codes, section reference numbers, etc.) anywhere
- [ ] Backticks around technical terms in prose
- [ ] Micro-context anchors (where present) address the specific fact the task depends on, not just the general topic
- [ ] Ungraded warm-up lessons are context-free (module intro carries the framing)
- [ ] New task types use placeholder syntax
- [ ] No categorize block has only one item
- [ ] Repeat occurrences of the same task type share an identical structural skeleton
- [ ] Correct answers are not clustered in the first option position across the curriculum
- [ ] `.new-task-types.md` documents every new type used

---

## Output 2: New task types file

Only needed if the conversion invented at least one new task type. If every activity mapped to an existing type, skip this file - do not create an empty one.

After writing the curriculum, document every invented task type in `.new-task-types.md` at the repository root, for developer implementation. Keep it lean.

Format each type as follows:

```markdown
## task-type-name

One sentence describing what the learner does.

### Markdown syntax

[full example block showing every field]

### Fields

- field-name: description. Required/Optional.

### Zod schema outline

\`\`\`
type: z.literal('task-type-name')
fieldName: z.string()
...
\`\`\`

### Notes

Any edge cases or constraints the developer needs to know. Keep to 2-3 sentences.
```

---

## Example: first vs subsequent lessons in a module

The first lesson of a module gets the framing. Subsequent lessons in the same module are leaner:

```markdown
## 1.1 Warm-up

### Prime Numbers

Try these before you study. Guessing is the point. These questions do not affect your score.

--multiple-choice--

Which of these is a prime number?

- [x] 7
- [ ] 9
- [ ] 12

--end-multiple-choice--

### Even Numbers

--multiple-choice--

Which of these is even?

- [x] 8
- [ ] 9
- [ ] 11

--end-multiple-choice--
```
