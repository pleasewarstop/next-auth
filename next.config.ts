import type { NextConfig } from "next";
import path from "path";
import loaderUtils from "loader-utils";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: true,
  sassOptions: {
    additionalData: `
      @use "@/app/vars.scss" as *;
    `,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
        port: "",
        pathname: "/product-images/**",
      },
    ],
  },
  webpack: (config: Configuration) => {
    applyPrettyClassNames(config);

    return config;
  },
};

function applyPrettyClassNames(config: Configuration) {
  const baseRule = config.module?.rules?.find(
    (rule) => typeof rule === "object" && typeof rule?.oneOf === "object"
  );
  if (!(baseRule && typeof baseRule === "object")) return;

  const rules = baseRule.oneOf?.filter((rule) =>
    Array.isArray(rule && rule.use)
  );

  rules?.forEach((rule) => {
    if (!(rule && "use" in rule && Array.isArray(rule.use))) return;
    rule.use?.forEach((loader) => {
      if (
        !(
          loader &&
          typeof loader === "object" &&
          "loader" in loader &&
          loader.loader?.includes("css-loader") &&
          !loader.loader?.includes("postcss-loader") &&
          loader.options &&
          typeof loader.options === "object" &&
          "modules" in loader.options &&
          loader.options.modules.getLocalIdent
        )
      ) {
        return;
      }
      loader.options.modules.getLocalIdent = folderIdent;
    });
  });
}

// @ts-expect-error need some time for fix
const folderIdent = (context, _: string, exportName: string) => {
  const resourcePath = context.resourcePath.replace(/\\+/g, "/");
  const folder = path.basename(path.dirname(resourcePath));

  const hash = loaderUtils
    .getHashDigest(
      Buffer.from(
        `filePath:${path
          .relative(context.rootContext, resourcePath)
          .replace(/\\+/g, "/")}#className:${exportName}`
      ),
      "md4",
      "base64",
      5
    )
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .replace(/^(-?\d|--)/, "_$1");

  return `${folder}__${exportName}__${hash}`;
};

export default nextConfig;
