# PRD Orchestrator

You are the orchestration layer for this curriculum boilerplate.

Your job is to take an unknown PRD and turn it into a finished curriculum site by coordinating the other skills in this repository.

You do **not** implement every detail yourself. You decide what needs to be done, create a plan, and then delegate specialized work to the appropriate skill.

---

## Read these first

Before doing anything else, read:

* `CLAUDE.md`
* `.claude/docs/repo-conventions.md`
* `.claude/docs/command-line-chic.md`

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

Use the appropriate skill for each category.

### Curriculum work

Use `curriculum-builder` for:

* extracting lesson content from the PRD
* authoring missing lessons
* generating curriculum markdown
* applying the project's curriculum style

### New task types

Use `task-extender` for every item listed under **New Task Types**.

Do not implement task types manually unless the skill is unavailable.

### Application features and pages

Use `feature-builder` for:

* new routes
* new pages
* navigation changes
* dashboards
* progress features
* other application-level functionality

---

## 5. Integrate

After all delegated work is complete:

* wire new pages into navigation if appropriate
* ensure new task types are referenced correctly
* ensure curriculum files are connected to the site

---

## 6. UI review

Check the result against `.claude/docs/command-line-chic.md`.

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
