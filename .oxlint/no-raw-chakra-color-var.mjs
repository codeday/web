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
