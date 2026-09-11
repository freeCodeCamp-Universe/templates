import { vi } from "vitest";
import { fireEvent } from "@testing-library/react";

// dnd-kit measures real DOM rects to resolve collisions, which jsdom doesn't
// compute (everything is 0x0 by default). Stubbing getBoundingClientRect on
// the elements involved lets a real pointer-driven drag resolve to a
// specific drop target, the same way it would in a real layout.
export function mockRect(element: Element, rect: Partial<DOMRect>) {
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

// Fires a real pointer-driven drag from `source` into `target`'s mocked
// rect. isPrimary/button are required for PointerSensor's activator to pick
// up the drag at all.
export function dragPointerTo(
  source: Element,
  target: Element,
  targetRect: Partial<DOMRect>,
  sourceRect: Partial<DOMRect> = { top: 0, left: 0, bottom: 40, right: 100 },
) {
  mockRect(source, sourceRect);
  mockRect(target, targetRect);

  const centerX = ((targetRect.left ?? 0) + (targetRect.right ?? 100)) / 2;
  const centerY = ((targetRect.top ?? 0) + (targetRect.bottom ?? 40)) / 2;

  fireEvent.pointerDown(source, { pointerId: 1, isPrimary: true, button: 0, clientX: 50, clientY: 20 });
  fireEvent.pointerMove(document, { pointerId: 1, clientX: centerX, clientY: centerY });
  fireEvent.pointerUp(document, { pointerId: 1, clientX: centerX, clientY: centerY });
}

// dnd-kit's PointerSensor swallows the very next click anywhere in the
// document for ~50ms after a drag ends (it stops propagation on one, to
// suppress the ghost click a real pointerup-after-drag would otherwise
// fire). A test that clicks something right after dragPointerTo needs to
// wait that out first, or the click can be silently eaten.
export async function waitOutDragClickGuard() {
  await new Promise((resolve) => setTimeout(resolve, 60));
}
