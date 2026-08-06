import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Order } from "./order";
import type { Task } from "../../lib/curriculum-tasks";

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

const ITEM_NAMES = task.items;

function getItemOrder(): string[] {
  const group = screen.getByRole("group", { name: "Put these in order:" });
  return within(group)
    .getAllByText(new RegExp(`^(${ITEM_NAMES.join("|")})$`))
    .map((el) => el.textContent!);
}

describe(Order, () => {
  it("renders items in shuffled order", () => {
    render(<Order task={task} onCorrect={() => {}} />);

    expect(getItemOrder()).toEqual(["Beta", "Gamma", "Alpha"]);
  });

  it("moves an item up when its up button is clicked", async () => {
    const user = userEvent.setup();

    render(<Order task={task} onCorrect={() => {}} />);

    await user.click(
      screen.getByRole("button", { name: "Move Gamma up" }),
    );

    expect(getItemOrder()).toEqual(["Gamma", "Beta", "Alpha"]);
  });

  it("moves an item down when its down button is clicked", async () => {
    const user = userEvent.setup();

    render(<Order task={task} onCorrect={() => {}} />);

    await user.click(
      screen.getByRole("button", { name: "Move Beta down" }),
    );

    expect(getItemOrder()).toEqual(["Gamma", "Beta", "Alpha"]);
  });

  it("disables the up button for the first item and down for the last", () => {
    render(<Order task={task} onCorrect={() => {}} />);

    expect(
      screen.getByRole("button", { name: "Move Beta up" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Move Alpha down" }),
    ).toBeDisabled();
  });

  it("restores the initial shuffled order on reset", async () => {
    const user = userEvent.setup();

    render(<Order task={task} onCorrect={() => {}} />);

    await user.click(
      screen.getByRole("button", { name: "Move Alpha up" }),
    );
    await user.click(
      screen.getByRole("button", { name: /reset/i }),
    );

    expect(getItemOrder()).toEqual(["Beta", "Gamma", "Alpha"]);
  });

  it("shows correct feedback and calls onCorrect for the right order", async () => {
    const onCorrect = vi.fn<() => void>();
    const user = userEvent.setup();

    render(<Order task={task} onCorrect={onCorrect} />);

    // Shuffled: ["Beta", "Gamma", "Alpha"]
    // Move Alpha up twice to get ["Alpha", "Beta", "Gamma"]
    await user.click(
      screen.getByRole("button", { name: "Move Alpha up" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Move Alpha up" }),
    );
    await user.click(
      screen.getByRole("button", { name: /check answer/i }),
    );

    expect(screen.getByRole("status")).toHaveTextContent("Correct!");
    expect(onCorrect).toHaveBeenCalledOnce();
  });

  it("shows incorrect feedback for the wrong order", async () => {
    const user = userEvent.setup();

    render(<Order task={task} onCorrect={() => {}} />);

    await user.click(
      screen.getByRole("button", { name: /check answer/i }),
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Not quite. Try again.",
    );
  });

  it("announces item movement for screen readers", async () => {
    const user = userEvent.setup();

    render(<Order task={task} onCorrect={() => {}} />);

    await user.click(
      screen.getByRole("button", { name: "Move Gamma down" }),
    );

    expect(screen.getByText(/Gamma moved down/)).toBeInTheDocument();
  });
});
