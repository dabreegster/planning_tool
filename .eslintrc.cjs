module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:svelte/recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
};