import neostandard, { plugins } from "neostandard";

export default [
  {
    ignores: ['.next/**', 'dist/**', 'build/**', 'node_modules/**']
  },
  ...neostandard({
    ts: true,
    filesTs: ['**/*.ts', '**/*.tsx'],
    ignores: ['.next/**', 'dist/**', 'build/**'],
  }),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      n: plugins.n,
    },
    rules: {
      // Allow Next.js font imports with underscores and API objects
      "camelcase": ["error", { 
        allow: ["^[A-Z][a-z]*_[A-Z][a-z]*$", ".*_.*"],
        ignoreImports: true,
        ignoreDestructuring: true,
        properties: "never"
      }],
      // Disable node-specific rules for browser environment
      "n/no-unsupported-features/node-builtins": "off",
      "n/no-missing-import": "off",
      "n/no-extraneous-import": "off",
      "n/prefer-global/process": "off",
      // React specific rules
      "react/jsx-handler-names": "off",
      // Style preferences
      "@stylistic/multiline-ternary": "off",
      "@stylistic/jsx-pascal-case": "off",
      "@stylistic/jsx-props-no-multi-spaces": "off",
      "@stylistic/brace-style": ["error", "1tbs", { allowSingleLine: true }],
      // Allow void in certain contexts
      "no-void": ["error", { allowAsStatement: true }],
      // Allow === for type safety
      "eqeqeq": ["error", "always"],
      // Allow unused vars with underscore prefix
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      // Allow console in development
      "no-console": "off",
      // Allow useless escape for regex patterns
      "no-useless-escape": "off",
      // Allow unmodified loop conditions
      "no-unmodified-loop-condition": "off",
      // Allow empty patterns for destructuring
      "no-empty-pattern": "off",
      // Allow misleading character classes
      "no-misleading-character-class": "off",
      // Allow useless return statements
      "no-useless-return": "off",
      // Allow redeclare for context types
      "@typescript-eslint/no-redeclare": "off",
      // Disable react-hooks rules that are not available
      "react-hooks/exhaustive-deps": "off",
    }
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // TypeScript specific overrides
      "@typescript-eslint/no-redeclare": "off",
    }
  }
];
