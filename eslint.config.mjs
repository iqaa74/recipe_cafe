import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      // Main Prisma generated files
      "./src/generated/prisma/client.js",
      "./src/generated/prisma/default.js",
      "./src/generated/prisma/edge.js",
      "./src/generated/prisma/index-browser.js",
      "./src/generated/prisma/index.d.ts",
      "./src/generated/prisma/wasm.js",

      // Runtime files
      "./src/generated/prisma/runtime/*.js",
      "./src/generated/prisma/runtime/*.d.ts",

      // Catch all for any other generated files
      "./src/generated/prisma/**/*.js",
      "./src/generated/prisma/**/*.d.ts",
    ],
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    excludes: ["./src/generated/**/*"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unnecessary-type-constraint": "off",
      "@typescript-eslint/no-wrapper-object-types": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
];

export default eslintConfig;
