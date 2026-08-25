import { describe, it, expect } from "vitest";
import { TASK_DEFINITIONS } from "./curriculum-tasks";
import {
  paragraph,
  list,
  listItem,
  taskList,
  nestedList,
  code,
} from "../test-utils/mdast-builders";

// --- Schema tests ---

describe("MultipleChoiceTaskSchema", () => {
  const schema = TASK_DEFINITIONS["multiple-choice"].schema;

  it("accepts a valid task with exactly one correct option", () => {
    const data = {
      type: "multiple-choice",
      question: "Pick one",
      options: [
        { text: "A", correct: true },
        { text: "B", correct: false },
      ],
    };

    expect(schema.parse(data)).toMatchObject({ question: "Pick one" });
  });

  it("rejects a task with zero correct options", () => {
    const data = {
      type: "multiple-choice",
      question: "Pick one",
      options: [
        { text: "A", correct: false },
        { text: "B", correct: false },
      ],
    };

    expect(() => schema.parse(data)).toThrow();
  });

  it("rejects a task with two correct options", () => {
    const data = {
      type: "multiple-choice",
      question: "Pick one",
      options: [
        { text: "A", correct: true },
        { text: "B", correct: true },
      ],
    };

    expect(() => schema.parse(data)).toThrow();
  });

  it("rejects a task with fewer than 2 options", () => {
    const data = {
      type: "multiple-choice",
      question: "Pick one",
      options: [{ text: "A", correct: true }],
    };

    expect(() => schema.parse(data)).toThrow();
  });
});

describe("SelectAllThatApplyTaskSchema", () => {
  const schema = TASK_DEFINITIONS["select-all-that-apply"].schema;

  it("accepts a task with one or more correct options", () => {
    const data = {
      type: "select-all-that-apply",
      question: "Select all",
      options: [
        { text: "A", correct: true },
        { text: "B", correct: true },
        { text: "C", correct: false },
      ],
    };

    expect(schema.parse(data)).toMatchObject({ question: "Select all" });
  });

  it("rejects a task with zero correct options", () => {
    const data = {
      type: "select-all-that-apply",
      question: "Select all",
      options: [
        { text: "A", correct: false },
        { text: "B", correct: false },
      ],
    };

    expect(() => schema.parse(data)).toThrow();
  });

  it("rejects a task with fewer than 2 options", () => {
    const data = {
      type: "select-all-that-apply",
      question: "Select all",
      options: [{ text: "A", correct: true }],
    };

    expect(() => schema.parse(data)).toThrow();
  });
});

describe("FillInBlankTaskSchema", () => {
  const schema = TASK_DEFINITIONS["fill-in-the-blank"].schema;

  it("accepts a task with at least one blank segment", () => {
    const data = {
      type: "fill-in-the-blank",
      segments: [
        { kind: "text", value: "Hello " },
        { kind: "blank", answers: ["world"] },
      ],
    };

    expect(schema.parse(data)).toMatchObject({ type: "fill-in-the-blank" });
  });

  it("rejects a task with zero blank segments", () => {
    const data = {
      type: "fill-in-the-blank",
      segments: [{ kind: "text", value: "Hello world" }],
    };

    expect(() => schema.parse(data)).toThrow();
  });
});

describe("CategorizeTaskSchema", () => {
  const schema = TASK_DEFINITIONS["categorize"].schema;

  it("accepts a valid task with unique items across categories", () => {
    const data = {
      type: "categorize",
      question: "Categorize these",
      categories: [
        { name: "Cat A", items: ["X"] },
        { name: "Cat B", items: ["Y"] },
      ],
    };

    expect(schema.parse(data)).toMatchObject({ question: "Categorize these" });
  });

  it("rejects duplicate items across categories", () => {
    const data = {
      type: "categorize",
      question: "Categorize these",
      categories: [
        { name: "Cat A", items: ["X"] },
        { name: "Cat B", items: ["X"] },
      ],
    };

    expect(() => schema.parse(data)).toThrow();
  });

  it("rejects fewer than 2 categories", () => {
    const data = {
      type: "categorize",
      question: "Categorize these",
      categories: [{ name: "Cat A", items: ["X"] }],
    };

    expect(() => schema.parse(data)).toThrow();
  });

  it("rejects a category with zero items", () => {
    const data = {
      type: "categorize",
      question: "Categorize these",
      categories: [
        { name: "Cat A", items: [] },
        { name: "Cat B", items: ["Y"] },
      ],
    };

    expect(() => schema.parse(data)).toThrow();
  });
});

describe("OrderTaskSchema", () => {
  const schema = TASK_DEFINITIONS["order"].schema;

  it("accepts a valid task with unique items", () => {
    const data = {
      type: "order",
      question: "Order these",
      items: ["A", "B", "C"],
    };

    expect(schema.parse(data)).toMatchObject({ question: "Order these" });
  });

  it("rejects duplicate items", () => {
    const data = {
      type: "order",
      question: "Order these",
      items: ["A", "A"],
    };

    expect(() => schema.parse(data)).toThrow();
  });

  it("rejects fewer than 2 items", () => {
    const data = {
      type: "order",
      question: "Order these",
      items: ["A"],
    };

    expect(() => schema.parse(data)).toThrow();
  });
});

describe("CrosswordTaskSchema", () => {
  const schema = TASK_DEFINITIONS["crossword"].schema;

  const validData = {
    type: "crossword",
    question: "Fill in the crossword using the clues below.",
    solution: [
      [null, "S", null, null],
      ["G", "L", "A", "D"],
      [null, "O", null, null],
      [null, "W", null, null],
    ],
    clues: [
      { direction: "across", clue: "A word meaning happy", row: 1, col: 0, length: 4 },
      { direction: "down", clue: "Opposite of fast", row: 0, col: 1, length: 4 },
    ],
  };

  it("accepts a valid intersecting grid", () => {
    expect(schema.parse(validData)).toMatchObject({ question: validData.question });
  });

  it("rejects a grid with uneven row lengths", () => {
    const data = { ...validData, solution: [["A", "B"], ["C"]] };

    expect(() => schema.parse(data)).toThrow();
  });

  it("rejects a grid with no clues", () => {
    const data = { ...validData, clues: [] };

    expect(() => schema.parse(data)).toThrow();
  });

  it("rejects when the across clue count doesn't match the grid", () => {
    const data = {
      ...validData,
      solution: [["A"], ["B"], ["C"]],
      clues: [
        { direction: "down", clue: "x", row: 0, col: 0, length: 3 },
        { direction: "across", clue: "y", row: 0, col: 0, length: 1 },
      ],
    };

    expect(() => schema.parse(data)).toThrow();
  });

  it("rejects when the down clue count doesn't match the grid", () => {
    const data = {
      ...validData,
      solution: [["A", "B", "C"]],
      clues: [
        { direction: "across", clue: "x", row: 0, col: 0, length: 3 },
        { direction: "down", clue: "y", row: 0, col: 0, length: 1 },
      ],
    };

    expect(() => schema.parse(data)).toThrow();
  });

  it("rejects a letter that isn't part of any across or down word", () => {
    const data = {
      ...validData,
      solution: [
        ["A", "B", null],
        [null, null, "C"],
      ],
      clues: [{ direction: "across", clue: "x", row: 0, col: 0, length: 2 }],
    };

    expect(() => schema.parse(data)).toThrow();
  });

  it("rejects a grid that splits into more than one disconnected group", () => {
    const data = {
      ...validData,
      solution: [
        ["A", "B", null, null, null],
        [null, null, null, "C", "D"],
      ],
      clues: [
        { direction: "across", clue: "x", row: 0, col: 0, length: 2 },
        { direction: "across", clue: "y", row: 1, col: 3, length: 2 },
      ],
    };

    expect(() => schema.parse(data)).toThrow();
  });
});

// --- Content parser tests ---

describe("parseOptionListContent", () => {
  const parse = TASK_DEFINITIONS["multiple-choice"].parseContent;

  it("extracts question and options from nodes", () => {
    const nodes = [
      paragraph("Which is correct?"),
      taskList([
        { text: "Option A", checked: true },
        { text: "Option B", checked: false },
      ]),
    ];

    const result = parse(nodes);

    expect(result.question).toBe("Which is correct?");
    expect(result.options).toEqual([
      { text: "Option A", correct: true },
      { text: "Option B", correct: false },
    ]);
  });

  it("returns empty question when no paragraph is present", () => {
    const nodes = [
      taskList([
        { text: "A", checked: true },
        { text: "B", checked: false },
      ]),
    ];

    const result = parse(nodes);

    expect(result.question).toBe("");
  });

  it("returns empty options when no list is present", () => {
    const nodes = [paragraph("Just a question")];

    const result = parse(nodes);

    expect(result.options).toEqual([]);
  });
});

describe("parseFillInBlankContent", () => {
  const parse = TASK_DEFINITIONS["fill-in-the-blank"].parseContent;

  type FillInBlankResult = {
    segments: Array<
      { kind: "text"; value: string } | { kind: "blank"; answers: string[] }
    >;
  };

  it("extracts blanks from {{answer}} syntax", () => {
    const nodes = [paragraph("The sky is {{blue}}")];

    const result = parse(nodes) as FillInBlankResult;

    expect(result.segments).toEqual([
      { kind: "text", value: "The sky is " },
      { kind: "blank", answers: ["blue"] },
    ]);
  });

  it("handles multiple blanks", () => {
    const nodes = [paragraph("{{one}} and {{two}}")];

    const result = parse(nodes) as FillInBlankResult;

    expect(result.segments).toEqual([
      { kind: "blank", answers: ["one"] },
      { kind: "text", value: " and " },
      { kind: "blank", answers: ["two"] },
    ]);
  });

  it("trims whitespace inside blanks", () => {
    const nodes = [paragraph("{{ hello }}")];

    const result = parse(nodes) as FillInBlankResult;

    expect(result.segments).toEqual([
      { kind: "blank", answers: ["hello"] },
    ]);
  });

  it("returns only text when there are no blanks", () => {
    const nodes = [paragraph("No blanks here")];

    const result = parse(nodes) as FillInBlankResult;

    expect(result.segments).toEqual([
      { kind: "text", value: "No blanks here" },
    ]);
  });
});

describe("parseCategorizeContent", () => {
  const parse = TASK_DEFINITIONS["categorize"].parseContent;

  it("parses nested list into categories with items", () => {
    const nodes = [
      paragraph("Categorize these:"),
      nestedList([
        { name: "Fruits", items: ["Apple", "Banana"] },
        { name: "Vegetables", items: ["Carrot"] },
      ]),
    ];

    const result = parse(nodes);

    expect(result.question).toBe("Categorize these:");
    expect(result.categories).toEqual([
      { name: "Fruits", items: ["Apple", "Banana"] },
      { name: "Vegetables", items: ["Carrot"] },
    ]);
  });

  it("returns empty question when no paragraph is present", () => {
    const nodes = [
      nestedList([
        { name: "A", items: ["X"] },
        { name: "B", items: ["Y"] },
      ]),
    ];

    const result = parse(nodes);

    expect(result.question).toBe("");
  });
});

describe("parseOrderContent", () => {
  const parse = TASK_DEFINITIONS["order"].parseContent;

  it("extracts question and ordered items", () => {
    const nodes = [
      paragraph("Order these:"),
      list([listItem("First"), listItem("Second"), listItem("Third")]),
    ];

    const result = parse(nodes);

    expect(result.question).toBe("Order these:");
    expect(result.items).toEqual(["First", "Second", "Third"]);
  });

  it("returns empty question when no paragraph is present", () => {
    const nodes = [list([listItem("A"), listItem("B")])];

    const result = parse(nodes);

    expect(result.question).toBe("");
  });
});

describe("parseCrosswordContent", () => {
  const parse = TASK_DEFINITIONS["crossword"].parseContent;

  it("extracts question, solution grid, and numbered clues from nodes", () => {
    const nodes = [
      paragraph("Fill in the crossword using the clues below."),
      code(".S..\nGLAD\n.O..\n.W.."),
      paragraph("Across:"),
      list([listItem("A word meaning happy")]),
      paragraph("Down:"),
      list([listItem("Opposite of fast")]),
    ];

    const result = parse(nodes);

    expect(result.question).toBe("Fill in the crossword using the clues below.");
    expect(result.solution).toEqual([
      [null, "S", null, null],
      ["G", "L", "A", "D"],
      [null, "O", null, null],
      [null, "W", null, null],
    ]);
    expect(result.clues).toEqual([
      { direction: "across", clue: "A word meaning happy", row: 1, col: 0, length: 4 },
      { direction: "down", clue: "Opposite of fast", row: 0, col: 1, length: 4 },
    ]);
  });

  it("returns empty question when no paragraph is present", () => {
    const nodes = [code("AB")];

    const result = parse(nodes);

    expect(result.question).toBe("");
  });
});
