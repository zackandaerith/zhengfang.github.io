export default [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "node_modules/**",
      ".git/**",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      // Basic rules that work with older Node versions
      "no-unused-vars": "warn",
      "no-console": "warn",
      "prefer-const": "error",
    },
  },
];
