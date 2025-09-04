import neostandard, { resolveIgnoresFromGitIgnore, plugins } from "neostandard";

export default [
  ...neostandard({
    ignores: resolveIgnoresFromGitIgnore, // Ignore files in dist/ and tests/ directories
    ts: true,
  }),
  plugins.n.configs["flat/recommended"],
];
// export default neostandard({

// });
// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// // == boilerplate ==
// // const configs = [
// //   ...compat.extends("next/core-web-vitals", "next/typescript"),
// // ];

// /** @type {import('eslint').Linter.Config[]} */
// const configs = [
//   ...compat.extends("next/core-web-vitals"),
//   ...compat.extends("next/typescript"),
//   ...compat.extends("plugin:@tanstack/eslint-plugin-query/recommended"),
//   ...compat.extends("prettier"),
//   ...compat.plugins("@tanstack/query"),
// ];

// export default configs;
