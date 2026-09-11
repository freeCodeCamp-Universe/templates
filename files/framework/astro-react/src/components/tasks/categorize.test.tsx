import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Categorize, findContainer, moveItem } from "./categorize";
import type { Task } from "../../lib/curriculum-tasks";

const task: Extract<Task, { type: "categorize" }> = {
  type: "categorize",
  question: "Sort these items:",
  categories: [
    { name: "Fruit", items: ["Apple", "Banana"] },
    { name: "Vegetable", items: ["Carrot"] },
  ],
};

beforeEach(() => {
  vi.spyOn(Math, "random").mockReturnValue(0.1);
});

function getZoneItems(zoneName: string): string[] {
  const zone = screen.getByRole("group", { name: zoneName });
  return within(zone)
    .queryAllByText((_, element) => element?.className === "item-card")
    .map((element) => element.textContent ?? "");
}

// dnd-kit measures real DOM rects to decide collisions, which jsdom doesn't
// compute (everything is 0x0 by default). Stubbing getBoundingClientRect on
// the specific elements involved lets a real pointer-driven drag resolve to
// a specific drop target, the same way it would in a real layout.
function mockRect(element: Element, rect: Partial<DOMRect>) {
  vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
    x: 0,
    y: 0,
    width: 100,
    height: 40,
    top: 0,
    left: 0,
    right: 100,
    bottom: 40,
    toJSON: () => {},
    ...rect,
  });
}

// Each zone gets its own, non-overlapping vertical band so the pointer
// coordinates land unambiguously in the intended target zone.
const ZONE_TOP: Record<string, number> = { Items: 0, Fruit: 200, Vegetable: 400 };

function dragItemToZone(itemText: string, zoneName: string) {
  const item = screen.getByText(itemText);
  const zone = screen.getByRole("group", { name: zoneName });
  const top = ZONE_TOP[zoneName];
  const centerY = top + 75;

  mockRect(item, { top: 0, left: 0, bottom: 40, right: 100 });
  mockRect(zone, { top, left: 0, bottom: top + 150, right: 300 });

  fireEvent.pointerDown(item, {
    pointerId: 1,
    isPrimary: true,
    button: 0,
    clientX: 50,
    clientY: 20,
  });
  fireEvent.pointerMove(document, { pointerId: 1, clientX: 50, clientY: centerY });
  fireEvent.pointerUp(document, { pointerId: 1, clientX: 50, clientY: centerY });
}

describe("findContainer", () => {
  it("finds the container an item currently belongs to", () => {
    const containers = { unplaced: ["a"], Fruit: ["b"] };

    expect(findContainer(containers, "b")).toBe("Fruit");
  });

  it("treats a container id as its own container", () => {
    const containers = { unplaced: [], Fruit: [] };

    expect(findContainer(containers, "Fruit")).toBe("Fruit");
  });

  it("returns undefined for an id that isn't in any container", () => {
    const containers = { unplaced: ["a"] };

    expect(findContainer(containers, "z")).toBeUndefined();
  });
});

describe("moveItem", () => {
  it("moves an item from one container to another", () => {
    const containers = { unplaced: ["a", "b"], Fruit: [] };

    const result = moveItem(containers, "a", "unplaced", "Fruit", "Fruit");

    expect(result.unplaced).toEqual(["b"]);
    expect(result.Fruit).toEqual(["a"]);
  });

  it("positions the item before overId, not just appended", () => {
    const containers = { unplaced: ["a"], Fruit: ["b", "c"] };

    const result = moveItem(containers, "a", "unplaced", "Fruit", "c");

    expect(result.Fruit).toEqual(["b", "a", "c"]);
  });
});

describe(Categorize, () => {
  it("starts with all items in the unplaced zone and categories empty", () => {
    render(<Categorize task={task} onCorrect={() => {}} />);

    expect(getZoneItems("Items")).toEqual(
      expect.arrayContaining(["Apple", "Banana", "Carrot"]),
    );
    expect(getZoneItems("Fruit")).toHaveLength(0);
    expect(getZoneItems("Vegetable")).toHaveLength(0);
  });

  it("shows a drop-here placeholder for an empty zone", () => {
    render(<Categorize task={task} onCorrect={() => {}} />);

    expect(within(screen.getByRole("group", { name: "Fruit" })).getByText("Drop here")).toBeInTheDocument();
  });

  it("shows unanswered feedback when not all items are placed", async () => {
    const user = userEvent.setup();
    render(<Categorize task={task} onCorrect={() => {}} />);

    await user.click(screen.getByRole("button", { name: /check answer/i }));

    expect(screen.getByText("Place all items before checking.")).toBeInTheDocument();
  });

  it("moves an item into a category by dragging it", () => {
    render(<Categorize task={task} onCorrect={() => {}} />);

    dragItemToZone("Apple", "Fruit");

    expect(getZoneItems("Fruit")).toContain("Apple");
    expect(getZoneItems("Items")).not.toContain("Apple");
  });

  it("shows correct feedback and calls onCorrect once everything is placed correctly", async () => {
    const onCorrect = vi.fn<() => void>();
    const user = userEvent.setup();
    render(<Categorize task={task} onCorrect={onCorrect} />);

    dragItemToZone("Apple", "Fruit");
    dragItemToZone("Banana", "Fruit");
    dragItemToZone("Carrot", "Vegetable");

    await user.click(screen.getByRole("button", { name: /check answer/i }));

    expect(screen.getByText("Correct!")).toBeInTheDocument();
    expect(onCorrect).toHaveBeenCalledOnce();
  });

  it("shows incorrect feedback for a wrong placement", async () => {
    const user = userEvent.setup();
    render(<Categorize task={task} onCorrect={() => {}} />);

    dragItemToZone("Apple", "Vegetable");
    dragItemToZone("Banana", "Fruit");
    dragItemToZone("Carrot", "Fruit");

    await user.click(screen.getByRole("button", { name: /check answer/i }));

    expect(screen.getByText("Not quite. Try again.")).toBeInTheDocument();
  });

  it("resets all items back to unplaced", async () => {
    const user = userEvent.setup();
    render(<Categorize task={task} onCorrect={() => {}} />);

    dragItemToZone("Apple", "Fruit");
    await user.click(screen.getByRole("button", { name: /reset/i }));

    expect(getZoneItems("Items")).toHaveLength(3);
    expect(getZoneItems("Fruit")).toHaveLength(0);
  });
});
