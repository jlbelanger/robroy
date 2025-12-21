import { defineConfig } from 'eslint/config'; // eslint-disable-line import/no-unresolved
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
	{
		ignores: ['build/**/*', 'dist/**/*', 'public/assets/js/*.min.js', 'vendor/**/*'],
	},
	{
		files: ['**/*.js'],
		extends: [
			js.configs.recommended,
			importPlugin.flatConfigs.recommended,
		],
		languageOptions: {
			ecmaVersion: 'latest',
			globals: globals.browser,
		},
		plugins: {
			'@stylistic': stylistic,
		},
		rules: {
			...stylistic.configs.customize({
				indent: 'tab',
				semi: true,
			}).rules,
			'@stylistic/array-bracket-newline': ['error', 'consistent'],
			'@stylistic/arrow-parens': ['error', 'always'],
			'@stylistic/brace-style': ['error', '1tbs'],
			'@stylistic/comma-dangle': ['error', {
				arrays: 'always-multiline',
				objects: 'always-multiline',
				imports: 'always-multiline',
				exports: 'always-multiline',
				functions: 'never',
			}],
			'@stylistic/curly-newline': ['error', { minElements: 1 }],
			'@stylistic/function-call-argument-newline': ['error', 'consistent'],
			'@stylistic/function-call-spacing': ['error', 'never'],
			'@stylistic/function-paren-newline': ['error', 'consistent'],
			'@stylistic/jsx-newline': 0,
			'@stylistic/jsx-pascal-case': ['error'],
			'@stylistic/jsx-self-closing-comp': ['error'],
			'@stylistic/jsx-sort-props': ['error'],
			'@stylistic/linebreak-style': ['error', 'unix'],
			'@stylistic/max-len': ['error', 150],
			'@stylistic/multiline-ternary': 0,
			'@stylistic/newline-per-chained-call': ['error'],
			'@stylistic/no-confusing-arrow': ['error'],
			'@stylistic/no-extra-semi': ['error'],
			'@stylistic/no-multi-spaces': ['error'],
			'@stylistic/object-curly-newline': [
				'error',
				{
					multiline: true,
					consistent: true,
				},
			],
			'@stylistic/one-var-declaration-per-line': ['error'],
			'@stylistic/padding-line-between-statements': ['error'],
			'@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
			'@stylistic/quote-props': ['error', 'as-needed'],
			'@stylistic/semi-style': ['error', 'last'],
			'@stylistic/switch-colon-spacing': ['error'],
			'no-console': ['error'],
			'sort-imports': ['error', { ignoreCase: true }],
			'import/extensions': ['error', 'ignorePackages'],
			'import/first': 'error',
			'import/newline-after-import': 'error',
			'import/no-extraneous-dependencies': 'error',
			'import/no-absolute-path': 'error',
			'import/no-cycle': 'error',
			'import/no-self-import': 'error',
			'import/no-useless-path-segments': 'error',
			'import/no-deprecated': 'error',
		},
	},
]);
