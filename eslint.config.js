// @ts-check

import eslint from '@eslint/js';
import jestPlugin from 'eslint-plugin-jest';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin-ts';

export default [
  {
    name: 'base ignore',
    ignores: ['**/coverage/**', '**/dist/**', '**/node_modules/**'],
  },
  eslint.configs.recommended,
  {
    name: 'javascript',
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.jquery,
        ...globals.browser,
      },
    },
  },
  ...tseslint.configs.recommended,
  {
    name: 'typescript',
    files: ['**/*.ts'],
    plugins: {
      '@stylistic/ts': stylistic,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@stylistic/ts/indent': ['error', 2],
      '@stylistic/ts/quotes': ['error', 'single'],
      '@stylistic/ts/semi': ['error', 'never'],
      '@stylistic/ts/comma-dangle': ['error', 'never'],
      '@stylistic/ts/quote-props': ['error', 'consistent-as-needed'],
    },
  },
  {
    name: 'jest',
    files: ['**/*.test.{js,ts}'],
    ...jestPlugin.configs['flat/recommended'],
    rules: {
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },
];
