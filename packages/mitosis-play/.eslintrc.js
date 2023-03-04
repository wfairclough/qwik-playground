module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["@builder.io/mitosis"],
  extends: ["../../.eslintrc.js", "plugin:@builder.io/mitosis/recommended"],
  rules: {
    // Use this to configure rules individually
    "@builder.io/mitosis/css-no-vars": "error",
  },
};
