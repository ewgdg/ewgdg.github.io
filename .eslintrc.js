module.exports = {
  "parser": "babel-eslint",
  env: {
    browser: true,
    es6: true,
    "jest/globals": true
  },
  extends: [
    'prettier',
    'airbnb',
    "plugin:prettier/recommended",
    "plugin:jest/recommended",
    "plugin:jest/style"
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'prettier',
    'react',
    'prettier',
    "jest"
  ],
  rules: {
    'prettier/prettier':'error',
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error"
  },
};
