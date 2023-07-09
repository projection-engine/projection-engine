module.exports = {
	"env": {
		"browser": true,
		"es2021": true,
		"node": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended"
	],
	"overrides": [
		{
			files: ["*.svelte"],
			processor: "svelte3/svelte3"
		},
		{
			"files": ["*.svelte"],
			"rules": {
				"no-undef": "off"
			}
		}
	],
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module"
	},
	"plugins": [
		"@typescript-eslint",
		"svelte3"
	],
	"rules": {
		"max-lines-per-function": ["warn", 15],
		"complexity": ["warn", 5],
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"windows"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"never"
		],
		"@typescript-eslint/ban-types": [
			"off",
			{
				"types": {
					"String": false,
					"Boolean": false,
					"Number": false,
					"Symbol": false,
					"{}": false,
					"Object": false,
					"object": false,
					"Function": false,
				},
				"extendDefaults": true,

			},
		],
		"@typescript-eslint/no-empty-function": "off",
		"@typescript-eslint/no-unused-vars": "off"
	}
}
