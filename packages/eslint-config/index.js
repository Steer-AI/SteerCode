module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'turbo',
    'prettier'
  ],
  plugins: ['svelte3', '@typescript-eslint'],
  ignorePatterns: ['*.cjs', '*.json'],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3'
    }
  ],
  settings: {
    'svelte3/typescript': () => require('typescript')
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020
  },
  env: {
    browser: true,
    es2017: true,
    node: true
  },
  rules: {
    '@typescript-eslint/no-inferrable-types': 'off',
    'no-extra-boolean-cast': 'off',
    'a11y-click-events-have-key-events': 'off'
  }
};
