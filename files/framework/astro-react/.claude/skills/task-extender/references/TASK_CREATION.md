# Task Extender

## Before Creating a New Task Type

Determine whether an existing task type already solves the problem.

1. Read `src/lib/curriculum-tasks.ts` to discover existing task schemas and definitions.
2. Inspect existing implementations in `src/components/tasks/`.
3. Find the closest existing task type.
4. Extend an existing task type if possible.
5. Only create a new task type when the interaction itself cannot reasonably be represented by an existing type.

## Creating a New Task Type

1. Decide the markdown syntax - what `--your-task-type--` looks like and what content follows it. Markers need a blank line before and after - the parser only recognizes a marker as its own paragraph.

2. In `src/lib/curriculum-tasks.ts`:
   - Add a Zod schema (`type: z.literal('your-task-type')` + fields), with `.refine()` for cross-field validation.
   - Add it to the exported `Task` union.
   - Write a `parseYourTypeContent(nodes)` function extracting structured data from raw mdast nodes.
   - Register both under a new key in `TASK_DEFINITIONS`.
   - Do not modify `parse-curriculum.ts` - the registry entry is the only parser change needed.

3. Build the component in `src/components/tasks/your-task-type.tsx`.
   - Add CSS if needed.
   - Reuse existing task styles where possible.
   - Follow existing task component patterns.
   - Hide the check button on success; disable inputs instead of hiding them. Any other new control (reset, hint, etc.) needs the same treatment.
   - Move focus to the task's container on success using the shared `useFocusOnCorrect` hook.
   - Use `aria-labelledby` instead of `<legend>`/`<label>` if the prompt or options need rich markdown. `role="radio"` does not support `aria-invalid`.
   - If the initial item order could reveal the answer, shuffle it client-side in a `useEffect` after mount, not during the initial render, to avoid a server/client hydration mismatch.

4. Wire it into `src/views/lesson.tsx`.
   - Add the new `block.task.type === 'your-task-type'` branch inside the lesson content dispatch.

5. Add at least one real example to `english.md` to verify parsing.

6. Verify:
   - lint
   - format
   - typecheck
   - build
   - deliberately break the example once to confirm validation fails clearly, then restore it.
