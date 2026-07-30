import type { Root } from 'mdast';

const TASK_COMPONENTS = new Set(['MultipleChoice', 'SelectAll', 'FillInTheBlank']);

function visit(node: unknown, fn: (node: unknown) => void): void {
  fn(node);
  const n = node as { children?: unknown[] };
  if (n.children) {
    for (const child of n.children) {
      visit(child, fn);
    }
  }
}

function evaluateStaticExpression(
  source: string,
  componentName: string,
  propName: string,
  filePath: string,
): unknown {
  try {
    return new Function(`"use strict"; return (${source})`)();
  } catch {
    throw new Error(
      `Cannot extract prop "${propName}" from <${componentName}> in ${filePath}: ` +
        `the value must be a static literal, not a variable or computed expression. Got: ${source}`,
    );
  }
}

type MdxJsxAttribute = {
  type: string;
  name: string;
  value: string | { type: string; value: string } | null;
};

type MdxJsxFlowElement = {
  type: string;
  name: string;
  attributes: MdxJsxAttribute[];
};

export function remarkExtractTasks() {
  return (tree: Root, file: { path?: string; data: Record<string, unknown> }) => {
    const tasks: Record<string, unknown>[] = [];

    visit(tree, (node) => {
      const el = node as MdxJsxFlowElement;
      if (el.type !== 'mdxJsxFlowElement' || !TASK_COMPONENTS.has(el.name)) {
        return;
      }

      const props: Record<string, unknown> = { type: el.name };

      for (const attr of el.attributes) {
        if (attr.type !== 'mdxJsxAttribute') continue;
        if (attr.name === 'client:load') continue;

        if (typeof attr.value === 'string') {
          props[attr.name] = attr.value;
        } else if (
          attr.value !== null &&
          typeof attr.value === 'object' &&
          attr.value.type === 'mdxJsxAttributeValueExpression'
        ) {
          props[attr.name] = evaluateStaticExpression(
            attr.value.value,
            el.name,
            attr.name,
            file.path ?? '<unknown>',
          );
        }
      }

      tasks.push(props);
    });

    const data = file.data as Record<string, Record<string, Record<string, unknown>>>;
    if (!data.astro) data.astro = {};
    if (!data.astro.frontmatter) data.astro.frontmatter = {};
    data.astro.frontmatter.tasks = tasks;
  };
}
