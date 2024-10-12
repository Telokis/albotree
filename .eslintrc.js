module.exports = {
  extends: ["@telokys/eslint-config-typescript"],
  rules: {
    "@typescript-eslint/no-empty-function": "off",
    "no-console": "off",
    "no-continue": "off",
    "no-empty": "off",
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "no-constant-condition": "off",
    "no-lonely-if": "off",
    "default-case": "off",
    "@typescript-eslint/switch-exhaustiveness-check": "error",
    curly: "error",
    "no-useless-constructor": "off",
    "no-empty-function": ["off"],
    "import/extensions": [
      "error",
      "always",
      {
        js: "never",
        ts: "never",
        jsx: "never",
        tsx: "never",
      },
    ],
  },
  parserOptions: {
    project: ["tsconfig.json"],
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".ts", ".jsx", ".tsx"],
      },
    },
    "import/extensions": [".js", ".ts", ".jsx", ".tsx"],
  },
};
