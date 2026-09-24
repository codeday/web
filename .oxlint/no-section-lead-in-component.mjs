const COMPONENTS_DIR = "/apps/www/src/components/";
const ALLOWED_DIRS = ["/apps/www/src/components/Page/"];
const SECTION_LEAD_COMPONENTS = new Set(["StatementBlock"]);
const SECTION_HEADING_LEVELS = new Set(["h1", "h2"]);

function jsxName(node) {
  if (node.type === "JSXIdentifier") return node.name;
  if (node.type === "JSXMemberExpression") return jsxName(node.property);
  return null;
}

function literalAttr(opening, attrName) {
  for (const attr of opening.attributes) {
    if (attr.type !== "JSXAttribute" || attr.name.name !== attrName) continue;
    if (!attr.value) return null;
    if (attr.value.type === "Literal") return attr.value.value;
    if (attr.value.type === "JSXExpressionContainer" && attr.value.expression.type === "Literal") {
      return attr.value.expression.value;
    }
    return null;
  }
  return null;
}

const rule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Components under apps/www/src/components must not render a section lead (StatementBlock, h1, h2); the page owns those.",
    },
    schema: [],
  },
  create(context) {
    const filename = (context.physicalFilename ?? context.filename ?? "").replaceAll("\\", "/");
    if (!filename.includes(COMPONENTS_DIR)) return {};
    if (ALLOWED_DIRS.some((dir) => filename.includes(dir))) return {};

    return {
      JSXOpeningElement(node) {
        const name = jsxName(node.name);
        if (!name) return;

        if (SECTION_LEAD_COMPONENTS.has(name)) {
          context.report({
            node,
            message: `<${name}> is a section lead — render it in the page beside this component, not inside it.`,
          });
          return;
        }

        const as = literalAttr(node, "as");
        if (typeof as === "string" && SECTION_HEADING_LEVELS.has(as)) {
          context.report({
            node,
            message: `<${name} as="${as}"> is a page/section heading — render it in the page beside this component. Use h3+ for headings that title an item inside the component.`,
          });
        }
      },
    };
  },
};

export default {
  meta: { name: "codeday" },
  rules: { "no-section-lead-in-component": rule },
};
