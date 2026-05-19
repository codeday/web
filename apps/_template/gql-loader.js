"use strict";
const path = require("path");
const fs = require("fs");
const { parse, visit } = require("graphql");

function resolveImports(source, filePath, visited = new Set()) {
  if (visited.has(filePath)) return [];
  visited.add(filePath);

  const dir = path.dirname(filePath);
  const lines = source.split(/\r\n|\r|\n/);
  let definitions = [];
  const queryLines = [];

  for (const line of lines) {
    if (line.trim().startsWith("#import")) {
      const match = line.match(/#import\s+["']([^"']+)["']/);
      if (match) {
        const importPath = path.resolve(dir, match[1]);
        const importSource = fs.readFileSync(importPath, "utf-8");
        definitions = definitions.concat(resolveImports(importSource, importPath, visited));
      }
    } else {
      queryLines.push(line);
    }
  }

  const cleanSource = queryLines.join("\n").trim();
  if (cleanSource) {
    const doc = parse(cleanSource);
    definitions = definitions.concat(doc.definitions);
  }

  return definitions;
}

function deduplicateDefs(defs) {
  const seen = new Set();
  return defs
    .slice()
    .reverse()
    .filter((def) => {
      if (def.kind === "FragmentDefinition") {
        if (seen.has(def.name.value)) return false;
        seen.add(def.name.value);
      }
      return true;
    })
    .reverse();
}

function collectFragmentRefs(def) {
  const refs = new Set();
  visit(def, {
    FragmentSpread(node) {
      refs.add(node.name.value);
    },
  });
  return refs;
}

function getTransitiveDeps(name, definitionMap, seen = new Set()) {
  if (seen.has(name)) return seen;
  seen.add(name);
  const def = definitionMap.get(name);
  if (def) {
    for (const ref of collectFragmentRefs(def)) {
      getTransitiveDeps(ref, definitionMap, seen);
    }
  }
  return seen;
}

module.exports = function (source) {
  if (this.cacheable) this.cacheable();

  const allDefs = resolveImports(source, this.resourcePath);
  const uniqueDefs = deduplicateDefs(allDefs);

  const definitionMap = new Map();
  for (const def of uniqueDefs) {
    if (def.name) {
      definitionMap.set(def.name.value, def);
    }
  }

  const namedDefs = uniqueDefs.filter(
    (d) => (d.kind === "OperationDefinition" || d.kind === "FragmentDefinition") && d.name,
  );

  function stripLoc(key, val) {
    return key === "loc" ? undefined : val;
  }

  const fullDoc = { kind: "Document", definitions: uniqueDefs };
  let output = `const _doc = ${JSON.stringify(fullDoc, stripLoc)};\n`;
  output += `export default _doc;\n\n`;

  for (const def of namedDefs) {
    const name = def.name.value;
    const deps = getTransitiveDeps(name, definitionMap);
    const subsetDefs = uniqueDefs.filter((d) => d.name && deps.has(d.name.value));
    const subsetDoc = { kind: "Document", definitions: subsetDefs };
    output += `export const ${name} = ${JSON.stringify(subsetDoc, stripLoc)};\n`;
  }

  return output;
};
