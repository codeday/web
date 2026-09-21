import type { StorybookConfig } from "@storybook/react-vite";

// One story per component (not one route per component group, the old
// Next.js gallery's shape). `docs` autodocs off by default; Alert/Modal/
// Header etc. carry non-obvious constraints better explained in each
// story's own description than an auto-generated props table.
const config: StorybookConfig = {
  stories: ["../src/stories/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: [],
};

export default config;
