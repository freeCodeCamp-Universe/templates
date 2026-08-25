import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SelectAll } from "./select-all";
import type { Task } from "../../lib/curriculum-tasks";

const task: Extract<Task, { type: "select-all-that-apply" }> = {
  type: "select-all-that-apply",
  question: "Select all correct answers.",
  options: [
    { text: "A", correct: true },
    { text: "B", correct: false },
    { text: "C", correct: true },
  ],
};

describe(SelectAll, () => {
  it("renders checkboxes for all options", () => {
    render(<SelectAll task={task} onCorrect={() => {}} />);

    expect(screen.getByRole("checkbox", { name: "A" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "B" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "C" })).toBeInTheDocument();
  });

  it("shows unanswered feedback when checking without a selection", async () => {
    const user = userEvent.setup();

    render(<SelectAll task={task} onCorrect={() => {}} />);

    await user.click(
      screen.getByRole("button", { name: /check answer/i }),
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Select at least one option first.",
    );
  });

  it("shows incorrect feedback for a partial selection", async () => {
    const user = userEvent.setup();

    render(<SelectAll task={task} onCorrect={() => {}} />);

    await user.click(screen.getByRole("checkbox", { name: "A" }));
    await user.click(
      screen.getByRole("button", { name: /check answer/i }),
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Not quite. Try again.",
    );
  });

  it("shows incorrect feedback when an extra wrong option is selected", async () => {
    const user = userEvent.setup();

    render(<SelectAll task={task} onCorrect={() => {}} />);

    await user.click(screen.getByRole("checkbox", { name: "A" }));
    await user.click(screen.getByRole("checkbox", { name: "B" }));
    await user.click(screen.getByRole("checkbox", { name: "C" }));
    await user.click(
      screen.getByRole("button", { name: /check answer/i }),
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Not quite. Try again.",
    );
  });

  it("shows correct feedback and calls onCorrect when exactly all correct options are selected", async () => {
    const onCorrect = vi.fn<() => void>();
    const user = userEvent.setup();

    render(<SelectAll task={task} onCorrect={onCorrect} />);

    await user.click(screen.getByRole("checkbox", { name: "A" }));
    await user.click(screen.getByRole("checkbox", { name: "C" }));
    await user.click(
      screen.getByRole("button", { name: /check answer/i }),
    );

    expect(screen.getByRole("status")).toHaveTextContent("Correct!");
    expect(onCorrect).toHaveBeenCalledOnce();
  });

  it("disables all checkboxes after a correct answer", async () => {
    const user = userEvent.setup();

    render(<SelectAll task={task} onCorrect={() => {}} />);

    await user.click(screen.getByRole("checkbox", { name: "A" }));
    await user.click(screen.getByRole("checkbox", { name: "C" }));
    await user.click(
      screen.getByRole("button", { name: /check answer/i }),
    );

    for (const checkbox of screen.getAllByRole("checkbox")) {
      expect(checkbox).toBeDisabled();
    }
  });
});
