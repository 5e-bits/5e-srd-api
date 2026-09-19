import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import eslintConfigPrettier from 'eslint-config-prettier'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import { importX } from 'eslint-plugin-import-x'
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
    name: 'typescript-and-imports-x',
    files: ['**/*.ts', '**/*.js'],
    extends: [
      ...tseslint.configs.recommended,
      importX.flatConfigs.recommended,
      importX.flatConfigs.typescript
    ],
    plugins: {
      '@stylistic': stylistic,
      'import-x': importX
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
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'object',
            'type'
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          pathGroups: [{ pattern: '@/**', group: 'internal', position: 'after' }],
          pathGroupsExcludedImportTypes: ['builtin', 'external', 'object', 'type']
        }
      ],
      'import-x/no-duplicates': 'error',
      'import-x/no-named-as-default': 'off',
      'import-x/no-named-as-default-member': 'off'
    },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project: './tsconfig.json'
        })
      ]
    }
  },
  eslintConfigPrettier // MUST BE LAST
)
