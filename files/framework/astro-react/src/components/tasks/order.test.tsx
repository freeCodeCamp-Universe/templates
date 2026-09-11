import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Order } from "./order";
import type { Task } from "../../lib/curriculum-tasks";
import { dragPointerTo, mockRect, waitOutDragClickGuard } from "../../test-utils/dnd";

const task: Extract<Task, { type: "order" }> = {
  type: "order",
  question: "Put these in order:",
  items: ["Alpha", "Beta", "Gamma"],
};

beforeEach(() => {
  // Deterministic shuffle: Math.random always returns 0.1
  // Fisher-Yates on ["Alpha","Beta","Gamma"] with 0.1:
  //   i=2: j=floor(0.1*3)=0, swap [2],[0] → ["Gamma","Beta","Alpha"]
  //   i=1: j=floor(0.1*2)=0, swap [1],[0] → ["Beta","Gamma","Alpha"]
  vi.spyOn(Math, "random").mockReturnValue(0.1);
});

function getItemOrder(): string[] {
  const group = screen.getByRole("group", { name: "Put these in order:" });
  return within(group)
    .queryAllByText((_, element) => element?.className === "item-card")
    .map((element) => element.textContent?.replace(/^\d+\.\s*/, "") ?? "");
}

// Sortable collision detection compares the dragged row against every other
// row's rect, not just the drop target - so, unlike categorize's separate
// zones, every row needs a distinct, stacked rect or the drop can land on
// the wrong neighbor.
const ROW_HEIGHT = 40;

function mockRowRects(order: string[]) {
  order.forEach((text, index) => {
    const row = screen.getByText(text).closest(".item-card");
    if (row) mockRect(row, { top: index * ROW_HEIGHT, left: 0, bottom: (index + 1) * ROW_HEIGHT, right: 100 });
  });
}

function dragItemToRow(itemText: string, targetText: string, currentOrder: string[]) {
  mockRowRects(currentOrder);
  const item = screen.getByText(itemText);
  const sourceRow = item.closest(".item-card");
  const targetRow = screen.getByText(targetText).closest(".item-card");
  if (!sourceRow || !targetRow) throw new Error("Could not find row");

  dragPointerTo(item, targetRow, targetRow.getBoundingClientRect(), sourceRow.getBoundingClientRect());
}

describe(Order, () => {
  it("renders items in shuffled order", () => {
    render(<Order task={task} onCorrect={() => {}} />);

    expect(getItemOrder()).toEqual(["Beta", "Gamma", "Alpha"]);
  });

  it("moves an item into a new position by dragging it", () => {
    render(<Order task={task} onCorrect={() => {}} />);

    dragItemToRow("Gamma", "Beta", ["Beta", "Gamma", "Alpha"]);

    expect(getItemOrder()).toEqual(["Gamma", "Beta", "Alpha"]);
  });

  it("shows correct feedback and calls onCorrect for the right order", async () => {
    const onCorrect = vi.fn<() => void>();
    const user = userEvent.setup();
    render(<Order task={task} onCorrect={onCorrect} />);

    // Shuffled: ["Beta", "Gamma", "Alpha"] - dragging Alpha to the front
    // gives the correct order in one move.
    dragItemToRow("Alpha", "Beta", ["Beta", "Gamma", "Alpha"]);
    await waitOutDragClickGuard();
    await user.click(screen.getByRole("button", { name: /check answer/i }));

    expect(screen.getByText("Correct!")).toBeInTheDocument();
    expect(onCorrect).toHaveBeenCalledOnce();
  });

  it("shows incorrect feedback for the wrong order", async () => {
    const user = userEvent.setup();
    render(<Order task={task} onCorrect={() => {}} />);

    await user.click(screen.getByRole("button", { name: /check answer/i }));

    expect(screen.getByText("Not quite. Try again.")).toBeInTheDocument();
  });

  it("restores the initial shuffled order on reset", async () => {
    const user = userEvent.setup();
    render(<Order task={task} onCorrect={() => {}} />);

    dragItemToRow("Alpha", "Beta", ["Beta", "Gamma", "Alpha"]);
    await waitOutDragClickGuard();
    await user.click(screen.getByRole("button", { name: /reset/i }));

    expect(getItemOrder()).toEqual(["Beta", "Gamma", "Alpha"]);
  });
});
