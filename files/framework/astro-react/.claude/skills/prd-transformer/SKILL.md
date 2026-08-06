---
name: prd-transformer
description: Transform a generic PRD into content and new tasks that are compatible with this codebase.
---

Load the task-extender skill then read @prd.md. Ignore everything except curriculum content.  First identify which new tasks need to be built and their schemas.  Write those to      
design/new-tasks.md.  The existing tasks can be found in @src/components/tasks/

Once you've created new-tasks.md extract the content from @prd.md and use it to replace @src/content/curriculum/english.md . The replacement should conform to the existing curriculum structure (section, modules and lessons) and the tasks will need to conform to the task schemas (both existing tasks and new tasks defined by @design/new-tasks.md).  Do NOT write any code - you should only modify english.md.

Analyse the PRD to find the specific lessons it contains.  Lessons should be actionable. They should include instructions for interacting with the learner.  Do not confuse reference material with lessons.
                                                                                             
Lessons should not contain multiple tasks, except for exams or review lessons. Exams or reviews should group tasks, do not split them.

Unless the PRD mandates it, reviews should appear at the end of the section they review, not at the start of the next section.

Name each lesson after its concept, not a generic label - Photosynthesis, not Warm-up Question 1.

Lesson descriptions should not give away answers to any questions in their tasks unless the PRD specifically states that they should.
