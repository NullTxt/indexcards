import jslint from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import tabroom from './config/eslint-tabroom.js';

import globals from 'globals';

import { includeIgnoreFile } from '@eslint/compat';
import { fileURLToPath } from 'node:url';

export default [
	jslint.configs.recommended,
	importPlugin.flatConfigs.recommended,
	prettier,
	tabroom,
	{
		ignores  : [
			'**/*.test.js',
			'config/*',
			'*.config.js',
			'.gitignore'
		],
	},
	{

		files : ['**/*.js', '*.js'],
		rules : {
			semi : 'error'
		},
		languageOptions : {
			ecmaVersion : 2023,
			sourceType  : 'module',
			globals     : { ...globals.node },
		},
	},
  	{
		files   : ['**/*.test.js'],
		plugins : {
			vitest,
		},
		rules: {
			...vitest.configs.recommended.rules,
			'@typescript-eslint/unbound-method': 'off',
		},
	},
];
