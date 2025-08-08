import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  // Base JS recommended rules
  js.configs.recommended,
  // Node config for build and tool config files
  {
    files: ['*.config.js', 'tailwind.config.js', 'vite.config.js', 'postcss.config.js'],
    languageOptions: {
      globals: globals.node,
      sourceType: 'module',
    },
  },
  // Project rules for JS/JSX files
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // React Hooks recommended subset (exhaustive-deps disabled due to plugin runtime issue under ESLint v9 flat config)
      'react-hooks/rules-of-hooks': 'error',
      // 'react-hooks/exhaustive-deps': 'warn',
      // React Refresh rule to keep components compatible with Fast Refresh
      'react-refresh/only-export-components': 'warn',
      // Local tweaks
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^[A-Z_]',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
])
