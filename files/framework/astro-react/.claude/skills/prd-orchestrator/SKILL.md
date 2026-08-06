---
name: prd-orchestrator
description: Takes a PRD, spec, or any document describing curriculum content and turns it into a finished curriculum site by coordinating the other skills in this repository (curriculum-from-prd, task-extender). Runs fully autonomously with no human checkpoints. Use when a user wants to build, generate, or populate this curriculum boilerplate from a PRD end to end.
---

# PRD Orchestrator

You are the orchestration layer for this curriculum boilerplate.

Your job is to take an unknown PRD and turn it into a finished curriculum site by coordinating the other skills in this repository.

You do **not** implement every detail yourself. You decide what needs to be done, create a plan, and then delegate specialized work to the appropriate skill.

---

## Read these first

Before doing anything else:

* Read `.claude/CLAUDE.md`, `.claude/REPO_CONVENTIONS.md`, and `.claude/skills/command-line-chic/SKILL.md`. Treat them as authoritative, with one explicit override: `CLAUDE.md` says to ask for clarification or for a missing path - this workflow runs with no human present, so wherever those two rules would apply, follow this skill's own Decision rules (make the most reasonable inferred choice, flag it in the final report) instead of stopping to ask.
* Inspect `src/lib/curriculum-tasks.ts`, `src/components/tasks/`, `src/views/`, and `src/pages/` to learn what capabilities already exist. Infer capabilities from the code, not a hardcoded list - you need this before you can classify the PRD in Step 1.

---

# Overall workflow

When asked to build a site from a PRD, follow this process in order.

## 1. Analyze the PRD

Determine what the PRD contains. Classify each requirement:

* **Content already provided** (full lessons, exercises, explanations, etc.)
* **Content to author** (topics/goals are provided, but lessons must be written)
* **Curriculum structure** (sections, modules, lesson ordering)
* **Activities that might not fit existing capabilities** (a coarse flag only - `curriculum-from-prd` determines the real list of new task types during delegation, not this step)
* **New pages** (landing pages, dashboards, catalog pages, etc.)
* **New application features** (progress tracking, search, certificates, accounts, etc.)
* **Visual/design guidance**
* **Ambiguous requests** (make the most reasonable inferred decision and note the assumption in the final report - there is no human to ask)
* **Deferred / rejected** (clearly out of scope, or nothing exists yet to build it - see Application features and pages below)

Do not assume every request should be implemented. This classification is the plan for the rest of the workflow - keep it in mind as you delegate, but it does not need to be written to a file. Nothing pauses for human review at any point in this workflow; work through every step to completion.

---

## 2. Delegate specialized work

Delegating to a skill means reading and following the instructions in that skill's file directly, not assuming a live tool-call mechanism. Name the exact file you are about to follow before you follow it.

### Curriculum work

Read and follow `.claude/skills/curriculum-from-prd/SKILL.md` for:

* extracting lesson content from the PRD
* authoring missing lessons
* generating curriculum markdown
* applying the project's curriculum style

This writes directly to `src/content/curriculum/english.md` (the live content file) and, if any activities did not fit an existing task type, produces `.new-task-types.md` at the repository root.

### New task types

If `.new-task-types.md` was not produced, `curriculum-from-prd` found nothing that needed a new type - there is nothing to do here, move on.

For every entry that is present, read and follow `.claude/skills/task-extender/SKILL.md`, entering at its documented **Autonomous entry point** (it explicitly covers being invoked with an already-fully-specified type, which is exactly what a `.new-task-types.md` entry is). That entry point skips Steps 1-3 and begins at Step 4, which itself reads `references/TASK_CREATION.md` as part of implementing. Step 5 (browser review) is also skipped per that same skill's own instructions in favor of Step 6's verification pass.

Do not implement task types manually unless `task-extender/SKILL.md` itself is unavailable.

### Application features and pages

There is currently no skill covering new routes, pages, navigation changes, dashboards, or other application-level features. Do not improvise this work.

Treat anything in this category as deferred, with a one-line reason ("no feature-building skill available yet"), and mention it prominently in the final report so a human can follow up.

---

## 3. UI review

Check the result against `.claude/skills/command-line-chic/SKILL.md`.

Prefer existing components and styling patterns. Do not invent new visual systems unless necessary.

The curriculum is the primary source of instructional content.
The surrounding application should remain quiet and unobtrusive.

Simplify the UI wherever possible. Review every page added or modified.

Remove unnecessary:
- Repeated, duplicate, or redundant text and information
- Explanatory paragraphs that state the obvious
- Multiple UI elements (cards, controls) communicating the same thing
- Empty or unnecessary cards and sections
- Decorative content that doesn't help the user complete a task
- Unnecessary whitespace

The application should support learning, not explain itself.

When unsure, simplify.

---

## 4. Verify

Run the project's verification commands (build, typecheck, lint, tests if available).

Also verify manually that:

* every lesson referenced by the curriculum exists
* every task type referenced by the curriculum exists and is correctly implemented
* every new page has a route and is wired into navigation if appropriate
* the curriculum file is connected to the site
* there are no obvious broken links or imports

Fix any issues before finishing.

---

## 5. Final report

Provide a concise summary:

* curriculum files created or updated
* task types added
* pages/features added
* verification results
* anything deferred or requiring human review

---

# Decision rules

* **Prefer existing patterns over new ones - but this is a default, not a mandate to flatten a genuinely different interaction into a worse-fitting existing type.** Apply `curriculum-from-prd`'s fit test for that specific decision, not this general preference.
* **Prefer extending the current system over introducing parallel systems.**
* **Prefer simpler implementations that satisfy the learning goal.**
* **Push back on requests that are clearly unrelated to the curriculum product** by deferring them, not by stopping to ask.
* **Never stop to ask a human mid-workflow.** If a decision cannot reasonably be inferred, make the most conservative choice available and flag the assumption in the final report.

---

# Important

Your goal is a **working, polished curriculum site today**, not a perfect architecture.

When in doubt, choose the implementation that:

1. follows existing repository patterns,
2. minimizes new complexity,
3. preserves the visual consistency of the boilerplate, and
4. produces a successful build.
