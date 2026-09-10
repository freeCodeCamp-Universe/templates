import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ImageSelect } from "./image-select";
import type { Task } from "../../lib/curriculum-tasks";

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect id="a" data-label="Region A" x="0" y="0" width="40" height="40"/>
  <rect id="b" data-label="Region B" x="60" y="60" width="40" height="40"/>
</svg>`;

const task: Extract<Task, { type: "image-select" }> = {
  type: "image-select",
  prompt: "Click region A.",
  imageSrc: "/images/test.svg",
  correct: ["a"],
};

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ text: () => Promise.resolve(SVG) }),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe(ImageSelect, () => {
  it("renders a checkbox for each region once the image loads", async () => {
    render(<ImageSelect task={task} onCorrect={() => {}} />);

    expect(await screen.findByRole("checkbox", { name: "Region A" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Region B" })).toBeInTheDocument();
  });

  it("treats a <line> element with an id as a selectable region", async () => {
    const lineSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <line id="wire" data-label="Wire" x1="0" y1="0" x2="100" y2="100"/>
    </svg>`;
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ text: () => Promise.resolve(lineSvg) }),
    );
    const lineTask: Extract<Task, { type: "image-select" }> = {
      type: "image-select",
      prompt: "Click the wire.",
      imageSrc: "/images/line.svg",
      correct: ["wire"],
    };

    render(<ImageSelect task={lineTask} onCorrect={() => {}} />);

    expect(await screen.findByRole("checkbox", { name: "Wire" })).toBeInTheDocument();
  });

  it("shows unanswered feedback when checking without a selection", async () => {
    const user = userEvent.setup();
    render(<ImageSelect task={task} onCorrect={() => {}} />);
    await screen.findByRole("checkbox", { name: "Region A" });

    await user.click(screen.getByRole("button", { name: /check answer/i }));

    expect(screen.getByText("Select at least one region first.")).toBeInTheDocument();
  });

  it("shows incorrect feedback for a wrong selection", async () => {
    const user = userEvent.setup();
    render(<ImageSelect task={task} onCorrect={() => {}} />);

    await user.click(await screen.findByRole("checkbox", { name: "Region B" }));
    await user.click(screen.getByRole("button", { name: /check answer/i }));

    expect(screen.getByText("Not quite. Try again.")).toBeInTheDocument();
  });

  it("shows correct feedback and calls onCorrect for the correct selection", async () => {
    const onCorrect = vi.fn<() => void>();
    const user = userEvent.setup();
    render(<ImageSelect task={task} onCorrect={onCorrect} />);

    await user.click(await screen.findByRole("checkbox", { name: "Region A" }));
    await user.click(screen.getByRole("button", { name: /check answer/i }));

    expect(screen.getByText("Correct!")).toBeInTheDocument();
    expect(onCorrect).toHaveBeenCalledOnce();
  });

  it("marks every region aria-disabled after a correct answer", async () => {
    const user = userEvent.setup();
    render(<ImageSelect task={task} onCorrect={() => {}} />);

    await user.click(await screen.findByRole("checkbox", { name: "Region A" }));
    await user.click(screen.getByRole("button", { name: /check answer/i }));

    for (const region of screen.getAllByRole("checkbox")) {
      expect(region).toHaveAttribute("aria-disabled", "true");
    }
  });

  it("defaults to the first region as the active descendant", async () => {
    render(<ImageSelect task={task} onCorrect={() => {}} />);

    const regionA = await screen.findByRole("checkbox", { name: "Region A" });

    expect(screen.getByRole("group")).toHaveAttribute("aria-activedescendant", regionA.id);
  });

  it("moves the active descendant with arrow keys and stops at the edge", async () => {
    const user = userEvent.setup();
    render(<ImageSelect task={task} onCorrect={() => {}} />);
    await screen.findByRole("checkbox", { name: "Region A" });
    const regionB = screen.getByRole("checkbox", { name: "Region B" });
    const group = screen.getByRole("group");

    group.focus();
    await user.keyboard("{ArrowRight}");
    expect(group).toHaveAttribute("aria-activedescendant", regionB.id);

    await user.keyboard("{ArrowRight}");
    expect(group).toHaveAttribute("aria-activedescendant", regionB.id);
  });

  it("toggles the active region's selection with Space", async () => {
    const user = userEvent.setup();
    render(<ImageSelect task={task} onCorrect={() => {}} />);
    await screen.findByRole("checkbox", { name: "Region A" });
    const group = screen.getByRole("group");

    group.focus();
    await user.keyboard(" ");

    // Query fresh rather than reusing the element found above: React replaces
    // the SVG's child nodes (via dangerouslySetInnerHTML) on this update, so
    // a reference captured before the keypress would point at a detached node.
    expect(screen.getByRole("checkbox", { name: "Region A" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });
});
