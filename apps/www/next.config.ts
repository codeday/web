import { paraglideWebpackPlugin } from "@inlang/paraglide-js";
import { apiFetch } from "@codeday/topo/utils";
import { withBotId } from "botid/next/config";
import { NextConfig } from "next";
import { NextJsWebpackConfig } from "next/dist/server/config-shared";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const nextConfig: NextConfig = {
  i18n: {
    locales: ["en", "es"],
    defaultLocale: "en",
    localeDetection: false,
  },
  turbopack: {
    rules: {
      "*.gql": {
        loaders: ["./gql-loader.js"],
        as: "*.js",
      },
    },
  },
  webpack: (config: any, { isServer }: any) => {
    const originalEntry = config.entry;
    config.entry = async () => {
      const entries = await originalEntry();

      if (entries["main.js"] && !entries["main.js"].includes("./src/polyfills.ts")) {
        entries["main.js"].unshift("./src/polyfills.ts");
      }

      return entries;
    };

    config.module.rules.push({
      test: /\.gql$/,
      exclude: /node_modules/,
      use: [require.resolve("./gql-loader.js")],
    });

    config.plugins.push(
      paraglideWebpackPlugin({
        outdir: "./src/paraglide",
        project: "../../packages/i18n/project.inlang",
        strategy: ["baseLocale"],
      }),
    );

    if (process.env.ANALYZE) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "server",
          analyzerPort: isServer ? 8888 : 8889,
          openAnalyzer: true,
        }),
      );
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        hostname: "f2.codeday.org",
      },
    ],
  },
  async redirects() {
    const { cms } = await apiFetch("{ cms { regions { items { webname aliases } } } }", {}, {});
    const webnames = (cms && cms.regions && cms.regions.items ? cms.regions.items : []).flatMap(
      (r: any) => [r.webname, ...(r.aliases || [])],
    );
    const staticRedirects = [
      {
        source: "/privacy/controls",
        destination: "/f/data-controls",
        permanent: false,
      },
      {
        source: "/legal/privacy/controls",
        destination: "/f/data-controls",
        permanent: false,
      },
      {
        source: "/privacy",
        destination: "/legal/privacy",
        permanent: false,
      },
      {
        source: "/privacy/third-party",
        destination: "/legal/privacy",
        permanent: false,
      },
      {
        source: "/conduct",
        destination: "/legal/code-of-conduct",
        permanent: false,
      },
      {
        source: "/conduct/report",
        destination: "/f/conduct-report",
        permanent: false,
      },
      {
        source: "/volunteer/purchase",
        destination: "/f/purchasing",
        permanent: false,
      },
      {
        source: "/volunteer/paragon",
        destination: "/f/paragon",
        permanent: false,
      },
      {
        source: "/volunteer/swag",
        destination: "/f/swag",
        permanent: false,
      },
      {
        source: "/organize",
        destination: "https://event.codeday.org/organize",
        permanent: false,
      },
      {
        source: "/volunteers",
        destination: "/volunteer",
        permanent: false,
      },
    ];

    return [
      ...staticRedirects,
      ...webnames.map((webname: string) => ({
        source: `/${webname}`,
        destination: `https://event.codeday.org/${webname}`,
        permanent: false,
      })),
    ];
  },
};
export default withBotId(nextConfig);
