import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Categorize } from "./categorize";
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
    .queryAllByRole("button", { pressed: undefined })
    .filter((button) => button.getAttribute("aria-label") === null)
    .map((button) => button.textContent ?? "");
}

describe(Categorize, () => {
  it("starts with all items in the unplaced zone", () => {
    render(<Categorize task={task} onCorrect={() => {}} />);

    expect(getZoneItems("Items")).toEqual(
      expect.arrayContaining(["Apple", "Banana", "Carrot"]),
    );
  });

  it("moves a selected item to a category zone", async () => {
    const user = userEvent.setup();

    render(<Categorize task={task} onCorrect={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Apple" }));
    await user.click(
      screen.getByRole("button", {
        name: /move selected item to fruit/i,
      }),
    );

    expect(getZoneItems("Fruit")).toContain("Apple");
    expect(getZoneItems("Items")).not.toContain("Apple");
  });

  it("moves an item back to unplaced when removed from a category", async () => {
    const user = userEvent.setup();

    render(<Categorize task={task} onCorrect={() => {}} />);

    // Place Apple in Fruit
    await user.click(screen.getByRole("button", { name: "Apple" }));
    await user.click(
      screen.getByRole("button", {
        name: /move selected item to fruit/i,
      }),
    );

    // Move Apple back to unplaced
    await user.click(screen.getByRole("button", { name: "Apple" }));
    await user.click(
      screen.getByRole("button", {
        name: /move selected item back to the unplaced items/i,
      }),
    );

    expect(getZoneItems("Items")).toContain("Apple");
    expect(getZoneItems("Fruit")).not.toContain("Apple");
  });

  it("shows correct feedback and calls onCorrect when all items are placed correctly", async () => {
    const onCorrect = vi.fn<() => void>();
    const user = userEvent.setup();

    render(<Categorize task={task} onCorrect={onCorrect} />);

    await user.click(screen.getByRole("button", { name: "Apple" }));
    await user.click(
      screen.getByRole("button", {
        name: /move selected item to fruit/i,
      }),
    );
    await user.click(screen.getByRole("button", { name: "Banana" }));
    await user.click(
      screen.getByRole("button", {
        name: /move selected item to fruit/i,
      }),
    );
    await user.click(screen.getByRole("button", { name: "Carrot" }));
    await user.click(
      screen.getByRole("button", {
        name: /move selected item to vegetable/i,
      }),
    );

    await user.click(
      screen.getByRole("button", { name: /check answer/i }),
    );

    expect(screen.getByRole("status")).toHaveTextContent("Correct!");
    expect(onCorrect).toHaveBeenCalledOnce();
  });

  it("shows incorrect feedback for wrong placements", async () => {
    const user = userEvent.setup();

    render(<Categorize task={task} onCorrect={() => {}} />);

    // Place all items, but Apple in wrong category
    await user.click(screen.getByRole("button", { name: "Apple" }));
    await user.click(
      screen.getByRole("button", {
        name: /move selected item to vegetable/i,
      }),
    );
    await user.click(screen.getByRole("button", { name: "Banana" }));
    await user.click(
      screen.getByRole("button", {
        name: /move selected item to fruit/i,
      }),
    );
    await user.click(screen.getByRole("button", { name: "Carrot" }));
    await user.click(
      screen.getByRole("button", {
        name: /move selected item to vegetable/i,
      }),
    );

    await user.click(
      screen.getByRole("button", { name: /check answer/i }),
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Not quite. Try again.",
    );
  });

  it("shows unanswered feedback when not all items are placed", async () => {
    const user = userEvent.setup();

    render(<Categorize task={task} onCorrect={() => {}} />);

    await user.click(
      screen.getByRole("button", { name: /check answer/i }),
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Place all items before checking.",
    );
  });

  it("resets all items to unplaced", async () => {
    const user = userEvent.setup();

    render(<Categorize task={task} onCorrect={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Apple" }));
    await user.click(
      screen.getByRole("button", {
        name: /move selected item to fruit/i,
      }),
    );
    await user.click(screen.getByRole("button", { name: /reset/i }));

    expect(getZoneItems("Items")).toHaveLength(3);
    expect(getZoneItems("Fruit")).toHaveLength(0);
  });
});
