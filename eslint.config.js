// @ts-check

import eslint from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin-ts'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  {
    name: 'base ignore',
    ignores: ['**/coverage/**', '**/dist/**', '**/node_modules/**']
  },
  eslint.configs.recommended,
  {
    name: 'javascript',
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.jquery,
        ...globals.browser
      }
    }
  },
  ...tseslint.configs.recommended,
  {
    name: 'typescript',
    files: ['**/*.ts'],
    plugins: {
      '@stylistic/ts': stylistic
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      },
      globals: {
        ...globals.node
      }
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'warn',
      '@typescript-eslint/no-require-imports': 'off'
    }
  },
  eslintConfigPrettier
]
