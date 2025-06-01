// @ts-check

import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import eslintConfigPrettier from 'eslint-config-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    name: 'base-ignore',
    ignores: ['**/coverage/**', '**/dist/**', '**/node_modules/**']
  },
  eslint.configs.recommended,
  // Main TypeScript and JS linting configuration
  {
    name: 'typescript-and-sorting',
    files: ['**/*.ts', '**/*.js'],
    extends: [...tseslint.configs.recommended],
    plugins: {
      '@stylistic': stylistic,
      'simple-import-sort': simpleImportSort
    },
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jquery
      }
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'warn',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error'
    }
  },
  eslintConfigPrettier
)
