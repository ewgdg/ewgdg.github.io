module.exports = {
  parser: "babel-eslint",
  env: {
    browser: true,
    es6: true,
    "jest/globals": true,
  },
  extends: [
    // "prettier",
    "airbnb",
    // "plugin:prettier/recommended",
    "plugin:jest/recommended",
    "plugin:jest/style",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["react", "jest"], //"prettier"
  rules: {
    // "prettier/prettier": "error",
    "eslint/semi": "never",
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",
    "react/no-unknown-property": [
      2,
      {
        ignore: ["jsx"],
      },
    ],
  },
}
