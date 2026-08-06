Do not code anything in here unless explicitely told to. It's just a place to track todo items.


Other quick fixes - 
sidebar should only expand current lesson - learn should expand all
arrows should be smaller





Fix task skill...
- everything needs to be correct - there is no partial credit tasks.
- allow to check at any point and give message if something is incomplete.
- always include an a11y option for everything when possible
- we should allow checking answers - but message should be to "finish" first.
- claude should propose the markdown first - user should approve
- markdown needs blank lines around the new custom markers.
- claude should give the plan for the user to approve
- claude should let the user know that they have enough info and will start building the task
- we need to describe the UI so claude knows the layout - its first implementation sucked
- buttons need to be by the other buttons
- claude should let the user know when they're done and what they added - just the markdown, the code to run it (not all the code, just that they wrote the code), and ask the user to check the UI and make sure it looks good.
- ui should be disabled after they get it correct - cursor: unavailable or whatever
- maybe claude should give a UI example?

---

still the skill -
We need to plan the markdown.
and the UI.

Should we also have self-review of the code or anything?

Other skills:
Generic feature additions?
What about a new page? or an update to the home page?

---

task messages:
info (please make a selection | place all items | etc.): blue
correct: green
wrong: red

- incorporate custom feedback into the tasks
- UI overhaul
- Task types:
  - fill in the blank - make blanks more lenient? Allow multiple answers per blank? like {{US|USA}}
  - drag and drop / match
  - memory game
  - quiz
  - put the items in order
  - find the mistake
  - text input?
  - maybe something with no "answer", just a "how do you feel about X"
  - what about multi-step mcq's - like a mini quiz - where each question shows up after you get the first one correct

- hotkeys to submit / check answers
- focus on next lesson when moving to the next lesson
- make modules and sections in curriculum map collapsible
- click area for tasks is not big enough. yea, probably should be like full width or something - same with sidebar
- buttons, is it wierd to have an achor with a click handler? Does astro have routing?
- "correct" hard coded text in the hook. Maybe something variable in case we change the text on the lesson pages.
- allow task groups - e.g: many mcq's with one check all button - or maybe mcq + select all + mcq + check all button.
- allow multi-lines in mcq / select all options
- use ids for slugs?
- add meta to sections/modules/lessons?
- add tests - for everything - parser + client.
  -Curriculum progress persistence — localStorage-backed lesson completion tracking. Deferred multiple times ("let's come back to this later"), never actually landed on the list.
  -Search bar for the sidebar/curriculum map — explicitly deferred when we built the sidebar.
  -Button aesthetic — the real repo's sharp-corner/thick-border style vs. our current soft-rounded Button component. Left as an open decision, not yet resolved either way.
  -Analytics script — mentioned early as independent/flexible, still needs a provider decision.
  -Progress page (view/download your progress) — explicitly "save for later," depends on progress persistence.
  -Landing page design — explicitly undecided (you even floated "maybe landing page is just /learn" and we agreed to revisit once the learn experience took shape — it has now).
  -Mobile-friendliness and a11y as ongoing checks — not a one-time task, more a "keep checking as things get built" reminder, which doesn't fit neatly as a checkbox item but is easy to lose track of if it's nowhere on the list.

Make sure the tasks and lessons can't have any extra text - any unexpected text. Builds should fail if so. Also heading structure should be in correct order.

- Add some skills?
- content review skill - is it syntactically correct? Are the lessons concise or something?
- skill for adding a task - and the repo conventions

- put fonts in repo - public folder.
- update how to create a task if I change the markdown.


More tasks from PRD:

--audio-multiple-choice--

[Audio: "The patient is hypotensive."]

What does this most likely mean?

- [x] The patient has low blood pressure.
- [ ] The patient has high blood pressure.
- [ ] The patient has a blood infection.

--end-audio-multiple-choice--

--card--

**a-/an-** — without, absent, not

Sound cue: uh / an

At the front of a medical word, a or an often removes something.

Examples: apnea, anoxia, anemia, anuria, anencephaly

--end-card--

--word-builder--

Build the word that means "nerve pain."

Tiles: neur, o, algia, emia

Answer: neur/algia

Note: The combining vowel drops before a suffix starting with a vowel.

--end-word-builder--