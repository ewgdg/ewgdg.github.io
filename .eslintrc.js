module.exports = {
  "parser": "babel-eslint",
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'prettier',
    'airbnb',
    "plugin:prettier/recommended"
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
    'prettier'
  ],
  rules: {
    'prettier/prettier':'error'
  },
};
