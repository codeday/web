// Raw `var(--chakra-colors-*)` CSS custom property references don't
// resolve this repo's own mode-aware colour tokens — @chakra-ui/react
// ships its own flat, non-mode-aware stock colour scale under the exact
// same `--chakra-colors-<hue>-<stop>` custom property name for every hue
// this repo also defines (gray/red/orange/yellow/green/teal/blue/purple/
// pink/cyan), and that stock value wins over this repo's semantic
// override at that property, in both light and dark mode — verified
// empirically (computed-style checks on `gray-700`, `gray-50`, `red-600`,
// `yellow-200`, `yellow-500` all returned Chakra's stock hex, never ours,
// regardless of `.dark`). See AGENTS.md's design-system section. Use a
// Chakra token prop/recipe value instead (`bg: "gray.50"`, which goes
// through Chakra's own build-time token resolution and correctly prefers
// this repo's override), or `useColorModeValue` reading `colors.ts`/
// `darkColors.ts` directly (see `Atom/Highlight`, `Organism/CreditLists`).

const PATTERN = /var\(\s*--chakra-colors-/;

function checkString(context, node, value) {
  if (typeof value !== "string") return;
  if (!PATTERN.test(value)) return;
  context.report({
    node,
    message:
      "Raw `var(--chakra-colors-*)` resolves to Chakra's own stock (non-mode-aware) palette, not this repo's tokens, in both light and dark mode. Use a token prop/recipe value (e.g. `bg: \"gray.50\"`) or `useColorModeValue` with `colors.ts`/`darkColors.ts` instead.",
  });
}

const rule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow raw `var(--chakra-colors-*)` CSS custom property references, which resolve to Chakra's stock (non-mode-aware) palette instead of this repo's own tokens.",
    },
    schema: [],
  },
  create(context) {
    return {
      Literal(node) {
        checkString(context, node, node.value);
      },
      TemplateElement(node) {
        checkString(context, node, node.value?.cooked ?? node.value?.raw);
      },
    };
  },
};

export default {
  meta: { name: "codeday-colors" },
  rules: { "no-raw-chakra-color-var": rule },
};
