# PRD Orchestrator

You are the orchestration layer for this curriculum boilerplate.

Your job is to take an unknown PRD and turn it into a finished curriculum site by coordinating the other skills in this repository.

You do **not** implement every detail yourself. You decide what needs to be done, create a plan, and then delegate specialized work to the appropriate skill.

---

## Read these first

Before doing anything else, read:

* `.claude/CLAUDE.md`
* `.claude/REPO_CONVENTIONS.md`
* `.claude/skills/command-line-chic/SKILL.md`

Treat those files as authoritative.

---

# Overall workflow

When asked to build a site from a PRD, follow this process in order.

## 1. Analyze the PRD

Determine what the PRD contains.

Classify each requirement into one of these categories:

* **Content already provided** (full lessons, exercises, explanations, etc.)
* **Content to author** (topics/goals are provided, but lessons must be written)
* **Curriculum structure** (sections, modules, lesson ordering)
* **New task types** (interactive lesson blocks not currently supported)
* **New pages** (landing pages, dashboards, catalog pages, etc.)
* **New application features** (progress tracking, search, certificates, accounts, etc.)
* **Visual/design guidance**
* **Ambiguous requests**

Do not assume every request should be implemented.

---

## 2. Inspect the repository

Use the codebase as the source of truth.

Especially inspect:

* `src/lib/curriculum-tasks.ts`
* `src/components/tasks/`
* `src/views/`
* `src/pages/`

Infer existing capabilities from the code instead of relying on hardcoded lists.

---

## 3. Create a build plan

Create a temporary file named `.build-plan.md` at the repository root.

Use this structure:

```md
# Build Plan

## Content

- Extract existing lessons from PRD
- Author missing lessons for ...

## Existing Capabilities

- multiple-choice
- fill-blank
- ...

## New Task Types

- timeline
- memory-diagram

## New Pages

- /placeholder

## New Features

- placeholder

## Deferred / Rejected

- animated mascot (out of scope)

## Open Questions

- none
```

The build plan is the contract for the rest of the workflow.

---

## 4. Delegate specialized work

Delegating to a skill means reading and following the instructions in that skill's file directly, not assuming a live tool-call mechanism. Name the exact file you are about to follow before you follow it.

### Curriculum work

Read and follow `.claude/skills/curriculum-from-prd/SKILL.md` for:

* extracting lesson content from the PRD
* authoring missing lessons
* generating curriculum markdown
* applying the project's curriculum style

This produces `curriculum.md` and, if any activities did not fit an existing task type, `new-task-types.md`.

### New task types

For every entry in `new-task-types.md`, read and follow `.claude/skills/task-extender/references/TASK_CREATION.md` directly, using that entry as an already-approved spec (markdown syntax + fields + schema outline).

`task-extender`'s own `SKILL.md` is written for a human collaborating interactively (it stops to ask for typed approvals like `approve markdown`). There is no human in this loop, so skip straight to its **Step 4: Implement** using the `new-task-types.md` entry as the pre-approved design, then continue through Steps 5-7 (browser review can be replaced by the verification pass in step 7 below; the self-review checklist in Step 6 still applies).

Do not implement task types manually unless neither file is available.

### Application features and pages

There is currently no skill covering new routes, pages, navigation changes, dashboards, or other application-level features. Do not improvise this work.

List anything in this category under **Deferred / Rejected** in the build plan with a one-line reason ("no feature-building skill available yet"), and mention it prominently in the final report so a human can follow up.

---

## 5. Integrate

After all delegated work is complete:

* wire new pages into navigation if appropriate
* ensure new task types are referenced correctly
* ensure curriculum files are connected to the site

---

## 6. UI review

Check the result against `.claude/skills/command-line-chic/SKILL.md`.

Prefer existing components and styling patterns. Do not invent new visual systems unless necessary.

The curriculum is the primary source of instructional content.
The surrounding application should remain quiet and unobtrusive.

Simplify the UI wherever possible. Review every page added or modified.

Remove unnecessary:
- Repeated or similar text within a page (that's not part of the curriculum?)
- Explanatory paragraphs that state the obvious
- Duplicate information
- Multiple UI elements communicating the same thing
- Empty cards or sections
- Decorative content that doesn't help the user complete a task
- Redundant text
- Unnecessary cards
- Duplicate controls
- Unnecessary whitespace

The application should support learning, not explain itself.

When unsure, simplify.

---

## 7. Verify

Run the project's verification commands (build, typecheck, lint, tests if available).

Also verify manually that:

* every lesson referenced by the curriculum exists
* every task type referenced by the curriculum exists
* every new page has a route
* there are no obvious broken links or imports

Fix any issues before finishing.

---

## 8. Final report

Provide a concise summary:

* curriculum files created or updated
* task types added
* pages/features added
* verification results
* anything deferred or requiring human review

---

# Decision rules

* **Prefer existing patterns over new ones.**
* **Prefer extending the current system over introducing parallel systems.**
* **Prefer simpler implementations that satisfy the learning goal.**
* **Push back on requests that are clearly unrelated to the curriculum product.**
* **Ask for clarification only when a decision cannot reasonably be inferred.**

---

# Important

Your goal is a **working, polished curriculum site today**, not a perfect architecture.

When in doubt, choose the implementation that:

1. follows existing repository patterns,
2. minimizes new complexity,
3. preserves the visual consistency of the boilerplate, and
4. produces a successful build.
