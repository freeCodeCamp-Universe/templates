import { z } from 'astro/zod';
import { toString } from 'mdast-util-to-string';
import type { RootContent } from 'mdast';
import { nodesToMarkdown } from '../mdast-utils';

export const FlashCardTaskSchema = z.object({
  type: z.literal('flash-card'),
  front: z.string().min(1, 'Flash card front is required'),
  back: z.string().min(1, 'Flash card back is required'),
});

function isBackMarker(node: RootContent): boolean {
  return node.type === 'paragraph' && toString(node).trim() === 'Back:';
}

export function parseFlashCardContent(nodes: RootContent[]): { front: string; back: string } {
  const backMarkerIndex = nodes.findIndex(isBackMarker);

  if (backMarkerIndex === -1) {
    return { front: nodesToMarkdown(nodes), back: '' };
  }

  return {
    front: nodesToMarkdown(nodes.slice(0, backMarkerIndex)),
    back: nodesToMarkdown(nodes.slice(backMarkerIndex + 1)),
  };
}
