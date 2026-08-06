# Boilerplate Repo

## Agent Rules

- NEVER read or traverse `node_modules/`, `dist/`, or `.git/`.
- NEVER search in folders not mentioned. If a needed path is missing, ask for its location.
- NEVER write or change anything in the repo's `.claude/` folder or its subfolders.
- NEVER run any git commands.
- NEVER install anything without asking.
- All paths are relative to the repo root.

## Working Style

- Prefer the simplest thing that works.
- Follow instructions exactly. Only do what is asked in a step or section.
- If anything is unclear, ask for clarification.
- If you see something unconventional, say something.
- If a rule seems wrong for the situation, explain why before deviating.

## Communication

- Always be explicit when writing anything. Avoid vague instructions or descriptions.
- Be as concise as possible while keeping necessary context.
- When writing user-facing code, avoid wording that makes it appear AI-generated (for example, avoid arrows or em dashes).

## Code Quality

- Follow existing repository conventions.
- Read `A11Y_AUDIT.md` before writing user-facing code.
- Follow accessibility standards.

## Skills

Use relevant skills before making specialized changes:

- UI/design work: read the `command-line-chic` skill.
- Creating curriculum task types: read the `references/TASK_CREATION.md` file in the `task-extender` skill.
