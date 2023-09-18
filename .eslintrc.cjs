/** @type {import('eslint').Linter.Config} */
module.exports = {
	plugins: ["eslint-plugin-react", "eslint-plugin-react-hooks", "@typescript-eslint"],
	extends: [
		"eslint:recommended",
		"@remix-run/eslint-config",
		"@remix-run/eslint-config/node",
		"plugin:react/recommended",
		"plugin:react-hooks/recommended",
		"plugin:@typescript-eslint/recommended-type-checked",
		"plugin:@typescript-eslint/stylistic",
		"prettier",
	],
	rules: {
		"react/react-in-jsx-scope": "off",
	},
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: "./tsconfig.json",
	},
};
