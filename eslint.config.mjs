import { createRequire } from "module";

const require = createRequire(import.meta.url);

/** Next.js 16 liefert Flat Config; FlatCompat + extends("next/…") erzeugt Zirkelreferenzen mit ESLint 9. */
const nextCoreWebVitals = require("eslint-config-next/core-web-vitals");

/** Regeln in bestehende Blöcke mergen (keine zweite Registrierung derselben Plugins). */
const mergedNext = nextCoreWebVitals.map((block) => {
  if (block.name === "next") {
    return {
      ...block,
      rules: {
        ...block.rules,
        "react/no-unescaped-entities": "warn",
        "@next/next/no-html-link-for-pages": "warn",
        // react-hooks v7 (eslint-config-next 16): zu strikt für bestehenden Code; schrittweise aktivieren
        "react-hooks/set-state-in-effect": "off",
        "react-hooks/purity": "off",
        "react-hooks/immutability": "off",
        "react-hooks/static-components": "off",
      },
    };
  }
  if (block.name === "next/typescript") {
    return {
      ...block,
      rules: {
        ...block.rules,
        "@typescript-eslint/no-explicit-any": "warn",
      },
    };
  }
  return block;
});

const eslintConfig = [
  ...mergedNext,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "test-*.js",
      "test-*.ts",
      "test-*.mjs",
      "test-*.cjs",
      "src/app.backup/**",
      "src/components.backup/**",
      "Schrift/**",
      "start-mobile-server.js",
      "simple-mobile-server.js",
      "fix-mobile-testing.js",
      "get-ngrok-url.js",
      "jest.config.js",
    ],
  },
  {
    files: ["**/__tests__/**/*.{ts,tsx}", "**/*.test.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;
