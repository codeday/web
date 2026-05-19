import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@codeday/topo", "@codeday/topocons"],
  turbopack: {
    rules: {
      "*.gql": {
        loaders: [path.resolve("gql-loader.js")],
        as: "*.js",
      },
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.gql$/,
      exclude: /node_modules/,
      loader: path.resolve("gql-loader.js"),
    });
    return config;
  },
};

export default nextConfig;
