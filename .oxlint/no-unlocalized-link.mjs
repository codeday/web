const LINK_ATOMS = [
  "packages/topo/src/Atom/Link/",
  "packages/topo/src/Atom/Box/",
  "packages/topo/src/Atom/Button/",
];

const isRootRelative = (value) =>
  typeof value === "string" && value.startsWith("/") && !value.startsWith("//");

const rawAnchorRule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow intrinsic `<a href=\"/...\">`, which skips the locale prefix that topo's Link/Box/Button add via Next's router.",
    },
    schema: [],
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name?.type !== "JSXIdentifier" || node.name.name !== "a") return;
        const href = node.attributes.find(
          (attr) => attr.type === "JSXAttribute" && attr.name?.name === "href",
        );
        const value = href?.value;
        const literal =
          value?.type === "Literal"
            ? value.value
            : value?.type === "JSXExpressionContainer" && value.expression.type === "Literal"
              ? value.expression.value
              : value?.type === "JSXExpressionContainer" &&
                  value.expression.type === "TemplateLiteral"
                ? value.expression.quasis[0]?.value.cooked
                : undefined;
        if (!isRootRelative(literal)) return;
        context.report({
          node,
          message:
            'Internal links must use `Link`, `Box as="a"`, or `Button as="a"` from `@codeday/topo/Atom` so they get the locale prefix (e.g. `/en-us/research`).',
        });
      },
    };
  },
};

const nextLinkImportRule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow importing `next/link` outside topo's link atoms; use `Link`/`Box`/`Button` from `@codeday/topo/Atom`, which wrap it automatically.",
    },
    schema: [],
  },
  create(context) {
    const filename = (context.physicalFilename ?? context.filename ?? "").replaceAll("\\", "/");
    if (LINK_ATOMS.some((dir) => filename.includes(dir))) return {};
    return {
      ImportDeclaration(node) {
        if (node.source.value !== "next/link") return;
        context.report({
          node,
          message:
            'Use `Link`, `Box as="a"`, or `Button as="a"` from `@codeday/topo/Atom` instead of `next/link`; they switch to Next\'s Link (with locale prefix) automatically.',
        });
      },
    };
  },
};

const CHAKRA_LINK_PRIMITIVES = new Set(["Box", "Button", "Link"]);

const chakraPrimitiveImportRule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow importing `Box`/`Button`/`Link` straight from `@chakra-ui/react` outside topo's Atom tier; the topo wrappers are what add the locale prefix to links.",
    },
    schema: [],
  },
  create(context) {
    const filename = (context.physicalFilename ?? context.filename ?? "").replaceAll("\\", "/");
    if (filename.includes("packages/topo/src/Atom/")) return {};
    return {
      ImportDeclaration(node) {
        if (node.source.value !== "@chakra-ui/react" || node.importKind === "type") return;
        for (const specifier of node.specifiers) {
          if (specifier.type !== "ImportSpecifier" || specifier.importKind === "type") continue;
          const name = specifier.imported.name ?? specifier.imported.value;
          if (!CHAKRA_LINK_PRIMITIVES.has(name)) continue;
          context.report({
            node: specifier,
            message: `Import \`${name}\` from \`@codeday/topo/Atom\` instead of \`@chakra-ui/react\`; only topo's wrapper adds the locale prefix when it renders a link.`,
          });
        }
      },
    };
  },
};

export default {
  meta: { name: "codeday-links" },
  rules: {
    "no-raw-internal-anchor": rawAnchorRule,
    "no-next-link-import": nextLinkImportRule,
    "no-chakra-link-primitive-import": chakraPrimitiveImportRule,
  },
};
