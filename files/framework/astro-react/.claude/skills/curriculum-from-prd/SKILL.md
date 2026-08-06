---
name: curriculum-from-prd
description: Converts a PRD, spec, outline, or any document containing curriculum or course content into a structured curriculum markdown file. Use this whenever Tom has a document with educational content to turn into lessons -- even if the document does not call itself a curriculum. Triggers on: "convert this PRD to curriculum", "turn this into lessons", "make a curriculum from this", "PRD to curriculum", "convert curriculum", "generate curriculum from this doc", "build lessons from this". When Tom pastes a document and asks about curriculum structure, always trigger this skill.
---

# PRD to Curriculum Converter

Converts an input document -- PRD, outline, spec, or any structured educational content -- into two output files:

1. A **curriculum markdown file** (`curriculum.md`) following the established schema
2. A **new task types file** (`new-task-types.md`) documenting any task types invented during the conversion

---

## Output 1: Curriculum format

A single `.md` file with YAML frontmatter and a hierarchy of Sections -> Modules -> Lessons:

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

- **Sections**: Number at the start or end -- match the PRD's own phrasing if it already numbers its top-level divisions. Examples: `Session 1`, `1. Introduction`, `Unit 2`.
- **Modules**: Decimal-numbered per section. Examples: `1.1 Word Parts`, `2.3 Practice`. Keep to 2-4 words.
- **Lessons**: No numbers. Name the lesson after the concept or item being practiced, not the activity type. Examples: `Hypotensive`, `The Four Pieces`, `hypo/glyc/emia`. Avoid constructions like `Lesson 3: Labeling Word Parts` or `Question 4`.

### Prose content rules

Do not use em-dashes, right arrows (->), or other characters that read as stylized punctuation in lesson content. Use plain commas, periods, and standard sentence structure. Write prose that sounds like a textbook or teacher, not generated text.

Bad: "Start with the suffix -- it tells you the kind of event."
Good: "Start with the suffix because it tells you the kind of event."

Use backticks for any word part or technical term referenced inline: `hepat`, `o`, `neur/o`, `-oma`, `hyper-`. This includes word parts in lesson prose, micro-context sentences, and task prompts.

**Do not include internal PRD identifiers** such as card IDs (P01, S01, R01, etc.) or section references in the curriculum output. Refer to concepts by name, not by ID.

**Do not add `<!-- NEW TYPE: ... -->` HTML comments in curriculum.md.** Those comments belong only in `new-task-types.md`.

---

## Granularity rule (important)

**One task per lesson is the default.** Split activities into as many lessons as there are practice items.

- A 5-item labeling exercise becomes 5 lessons, each with one task.
- A 6-question listening round becomes 6 lessons.
- A 4-question cold open becomes 4 lessons.
- An 8-question exit ticket becomes 8 lessons (unless it reads like a final exam, in which case keep it as one lesson).

The exception is when splitting would be disjointed: a reference table followed immediately by one matching exercise can share a lesson. But a reference table followed by 5 separate questions means 1 reference lesson + 5 task lessons.

When a lesson contains one question about a specific word or concept, name the lesson after that concept. For example, a question about the word "hypotensive" gets the lesson title `Hypotensive`, not `Cold Open Question 1` or `Audio Practice`.

Explanatory text that introduces a new concept is its own lesson with no task. Do not force a task onto every lesson -- some lessons are just reading.

---

## Lesson prose rule (important)

Every lesson must have either prose before the task block or a self-contained task prompt inside the block. Never leave a lesson that is just a bare task block with nothing to orient the learner.

**When the lesson is the first in a module:** Write one to three sentences establishing the module's purpose. Subsequent lessons in the same module do not need to repeat this framing -- the module title and the task prompt carry it.

**When the lesson is not the first in a module:** Omit repeated framing. The task prompt inside the block is enough if it is self-contained (e.g., "Which ending would make you ask 'what is inflamed?'" is self-contained). But if the task refers to something not visible in the lesson itself (e.g., "using your decoder" without defining the decoder), rewrite the task prompt to be self-contained, or add a one-sentence anchor.

**Make task prompts self-contained:** The question or instruction inside a task block should make sense on its own, without requiring the learner to remember what was said three lessons ago. Instead of "Decode this using your decoder," write "Break this word into known parts." Instead of "Match the card," write "Match each suffix to its meaning."

---

## Micro-context rule (important)

Some lessons are one of many practice items in a sequence. When the task requires the learner to recall something specific, a brief anchor sentence before the task block helps.

**When to add a micro-context sentence:**
- A categorize or label task where the lesson is about a specific word, and the key fact needed is the *grammatical role* of its parts (root, suffix, prefix, combining vowel) -- not just its meaning.
- A word-builder task where the learner needs to know the meaning of the target word to evaluate which tiles to pick.

**When NOT to add one:**
- Cold open / ungraded warm-up items (intentionally context-free -- the PRD will say so).
- Listening round items (designed to test recognition, not recall of definitions).
- Multiple-choice questions where the question itself provides everything needed.
- Categorize tasks where the learner just studied the relevant cards -- the cards are the context and the task is meant to test recall.

**What the anchor should say:** For a categorize task testing grammatical role, the anchor should name the role: "`hemat` is a root; `-oma` is a suffix that signals a mass or swelling." For a word-builder task, the anchor should give the meaning hint: "Build the word that means inflammation of the liver." (That last one usually goes inside the task prompt itself, not as separate prose.)

Do not use an anchor that only restates meaning without helping with the task. "hemat means blood" does not help the learner label `hemat` as a root rather than a suffix.

Example -- correct anchor for a categorize task:
```markdown
### hemat/oma

`hemat` is a root; `-oma` is a suffix.

--categorize--

Label each part of `hemat/oma`.

- Root
  - hemat
- Suffix
  - oma

--end-categorize--
```

Example -- cold open lesson, no anchor needed:
```markdown
### Intracranial Hematoma

--audio-multiple-choice--

[Audio: "The scan shows an intracranial hematoma."]

What does this most likely describe?

- [x] A mass of blood inside the skull.
- [ ] Inflammation below the skin.
- [ ] A tumor around the heart.

--end-audio-multiple-choice--
```

---

## Step 1: Identify the PRD section types

PRDs for longer courses often contain several different kinds of sections. Before writing anything, identify which type each section is:

| Section type | Recognizable by | What to do |
|---|---|---|
| **Session / unit content** | Has activities, tasks, practice items | Convert to curriculum modules and lessons |
| **Learner contract / intro text** | Says "display this before session 1" or gives rules of the game | Include as a lesson (or a few lessons) in the first module of the first session. Keep "display verbatim" text as blockquote prose. |
| **Notation or reference tables** | Tables of syntax, symbols, or vocabulary with no practice | Include as a lesson (no task) if the learner needs to read it |
| **Canonical card inventory** | A catalogue of word-part families, each with a definition, sound cue, coach line, and examples | Extract cards for embedding within the session that introduces them (see Card lessons below) |
| **Session map / schedule** | A table of sessions with timing, themes, and card lists | Omit. Use it to understand flow and which cards appear in which session, but do not include it in the curriculum |
| **Outcomes / objectives** | Bullet lists of what the learner will be able to do | Omit |
| **Product thesis / research** | Context for why the product exists, research citations | Omit |
| **Mastery levels table** | Explains how progress is tracked | Omit unless the PRD explicitly says to show it to learners |

When a session section says "show cards X through Y" or "show canonical cards...", those cards become a module of card lessons within that session. Pull the card content from the canonical inventory section.

---

## Step 2: Plan the structure before writing

Sketch the structure before writing output. For each activity in the PRD, count the individual items and plan that many lessons. Think through:

- Is this activity one concept explained, or a set of practice items?
- If it is a set of items, each item is a lesson.
- What is the best lesson title for each item (the concept, not the activity)?
- Which lessons need a task and which are just reading?
- Which lessons need a micro-context anchor? What should it say?
- Which card families need to be expanded as card study lessons?

---

## Task content rule

**Every task block must contain a task — a question, instruction, or prompt that tells the learner what to do.** A task block with only answer options and no question is incomplete. A task block with only content to read and no action is not a task.

- `--multiple-choice--` must contain a question the learner answers.
- `--categorize--` must contain an instruction like "Label each part of `hemat/oma`." or "Match each suffix to its meaning."
- `--fill-in-the-blank--` must contain a sentence with at least one `{{blank}}`.
- `--audio-multiple-choice--` must contain a `[Audio: "..."]` line and a question.
- `--word-builder--` must contain a "Build the word that means..." prompt, a `Tiles:` line, and an `Answer:` line.
- `--order--` must contain an instruction and an ordered list.

If the PRD provides the items but not an explicit instruction, write a clear one. "Label each part" is better than nothing; "Which of these endings means inflammation?" is better than a bare list of options.

---

## Step 3: Map activities to task types

### Existing task types

**`--multiple-choice--`** -- One correct answer. Use for comprehension checks, recall, single-correct quizzes.

```
--multiple-choice--

Which ending would make you ask "what is inflamed?"

- [x] `-itis`
- [ ] `-emia`
- [ ] `-oma`
- [ ] `-algia`

--end-multiple-choice--
```

**`--select-all-that-apply--`** -- Multiple correct answers. Use for "which of these are true" or identifying multiple valid items.

```
--select-all-that-apply--

Which of these are valid?

- [x] Correct.
- [ ] Incorrect.
- [x] Also correct.

--end-select-all-that-apply--
```

**`--fill-in-the-blank--`** -- Complete sentences with missing words. Use for vocabulary recall, completing definitions. Mark each blank with `{{answer}}`. Write task prompts that are self-contained -- avoid phrasing like "using your decoder" which requires memory of earlier lessons.

```
--fill-in-the-blank--

`hyper-` means {{above normal or excessive}}.

--end-fill-in-the-blank--
```

**`--categorize--`** -- The learner sorts **multiple items** into multiple categories (drag-and-drop). Use when you have several terms to distribute across a few buckets — for example, labeling word parts (`hemat`, `oma` → Root / Suffix) or sorting a set of terms into groups. List categories as top-level bullets, items as sub-bullets.

**Do not use `--categorize--` when there is only one item.** A single item being sorted into one of five categories is just a multiple-choice question — use `--multiple-choice--` with the categories as options instead.

```
--categorize--

Label each part of `hemat/oma`.

- Root
  - hemat
- Suffix
  - oma

--end-categorize--
```

Good use: labeling both parts of a compound word, grouping 6 terms into 3 columns, matching prefixes to meanings.
Bad use: "Sort `necrosis` into one of these five categories" — that is a multiple-choice question.

**`--order--`** -- Arrange items in the correct sequence. Use for steps in a process, stages of a procedure.

```
--order--

Put these steps in order.

1. First step.
2. Second step.
3. Third step.

--end-order--
```

### New task types (placeholder syntax)

For activities that do not fit existing types, use a sensible kebab-case type name as a placeholder. Document each new type in `new-task-types.md` (Output 2).

**`--audio-multiple-choice--`** -- The learner hears audio then answers a question. The `[Audio: "..."]` line captures the spoken transcript; actual audio files will be generated separately. Use when the PRD describes audio stimuli.

```
--audio-multiple-choice--

[Audio: "The patient is hypotensive."]

What does this most likely mean?

- [x] The patient has low blood pressure.
- [ ] The patient has high blood pressure.
- [ ] The patient has a blood infection.

--end-audio-multiple-choice--
```

**`--word-builder--`** -- The learner assembles a word from labeled tiles (click or tap). Use when the PRD asks learners to construct words from component parts. List available tiles and the correct answer. Include a `Note:` line for special rules such as vowel dropping.

```
--word-builder--

Build the word that means "nerve pain."

Tiles: neur, o, algia, emia

Answer: neur/algia

Note: The combining vowel drops before a suffix starting with a vowel.

--end-word-builder--
```

If you encounter an activity type not covered above, invent a sensible kebab-case type name, use placeholder syntax, and document it in `new-task-types.md`.

### Card study lessons (no task block)

When a session introduces canonical word-part cards, each card family becomes its own lesson. **Do not use a task block for card study** -- cards are not quizzes. Write the card content as formatted lesson prose.

Format each card lesson like this:

```markdown
### hyper-/hypo-

**hyper-/hypo-** -- above or below normal

Sound cue: HIGH-per / HIGH-poh

Hyper goes high; hypo goes low.

Examples: `hypertension`, `hypotension`, `hyperglycemia`, `hypoglycemia`, `hyperkalemia`
```

Name the lesson after the word-part family (e.g., `hyper-/hypo-`, `a-/an-`, `-itis`), not after an internal ID. Do not include internal IDs anywhere.

---

## Step 4: Handling overhead content

| PRD content | What to do |
|---|---|
| Learning outcomes / objectives | Omit |
| Minute-by-minute schedule | Omit; use it only to understand session flow and card ordering |
| Learner contract / framing intro | Include as prose lessons in the first module. Use blockquote (`>`) for text the PRD says to "display verbatim" |
| Notation tables | Include as a lesson (no task) if the learner needs to read it before practicing |
| Mastery level table | Omit |
| Wrap-up / transition text | Include as closing prose on the last lesson of a section if it orients the learner; omit if structural |
| Card inventory section | Do not include as a standalone section; extract and embed cards session by session |

---

## Step 5: Quality checklist

Before finalizing, verify:

- [ ] YAML frontmatter with `title`
- [ ] Sections use numbered titles
- [ ] Every module has a decimal number (1.1, 1.2, not just 1, 2)
- [ ] Lesson titles have no leading or trailing numbers
- [ ] Lesson titles are concise (2-5 words)
- [ ] Every lesson has either prose before the task or a self-contained task prompt
- [ ] Task prompts do not reference "your decoder" or other context-dependent labels
- [ ] Most lessons have exactly one task block
- [ ] No em-dashes or arrows in prose
- [ ] No `<!-- NEW TYPE -->` comments in curriculum.md
- [ ] No internal PRD IDs (P01, S01, R01, etc.) anywhere
- [ ] Backticks around word parts and technical terms in prose
- [ ] Micro-context anchors (where present) address grammatical role, not just meaning
- [ ] Cold open and listening round lessons are context-free (module intro carries the framing)
- [ ] Card study lessons are prose, not task blocks
- [ ] New task types use placeholder syntax (no `<!-- NEW TYPE -->` comment in curriculum.md)
- [ ] `new-task-types.md` documents every new type used

---

## Output 2: New task types file

After writing the curriculum, write a second file documenting every new task type invented during the conversion. This file is for developer implementation — keep it lean.

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

Note: `<!-- NEW TYPE: ... -->` HTML comments belong here and ONLY here, not in curriculum.md.

---

## Example: first vs subsequent lessons in a module

The first lesson of a module gets the framing. Subsequent lessons in the same module are leaner:

```markdown
## 1.1 Cold Open

### Hypotensive

Try these before you study. Guessing is the point. These questions do not affect your score.

--audio-multiple-choice--

[Audio: "The patient is hypotensive."]

What does this most likely mean?

- [x] The patient has low blood pressure.
- [ ] The patient has high blood pressure.
- [ ] The patient has a blood infection.

--end-audio-multiple-choice--

### Intracranial Hematoma

--audio-multiple-choice--

[Audio: "The scan shows an intracranial hematoma."]

What does this most likely describe?

- [x] A mass of blood inside the skull.
- [ ] Inflammation below the skin.
- [ ] A tumor around the heart.

--end-audio-multiple-choice--
```

## Example: card study module (prose, no task block)

```markdown
## 1.3 Word-Part Cards

### a-/an-

**a-/an-** -- without, absent, not

Sound cue: uh / an

At the front of a medical word, `a-` or `an-` often removes something.

Examples: `apnea`, `anoxia`, `anemia`, `anuria`, `anencephaly`

### dys-

**dys-** -- bad, painful, difficult, abnormal

Sound cue: diss

`dys-` says a normal function has become difficult, painful, or abnormal.

Examples: `dyspnea`, `dysuria`, `dysphagia`, `dysplasia`, `dysrhythmia`
```

## Example: categorize lesson with role anchor

After the card module, labeling tasks need an anchor on the grammatical role (not just the meaning):

```markdown
### hemat/oma

`hemat` is a root; `-oma` is a suffix.

--categorize--

Label each part of `hemat/oma`.

- Root
  - hemat
- Suffix
  - oma

--end-categorize--
```
