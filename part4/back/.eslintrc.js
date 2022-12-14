module.exports = {
	env: {
		commonjs: true,
		es2021: true,
		node: true,
		jest: true,
	},
	extends: "eslint:recommended",
	overrides: [],
	parserOptions: {
		ecmaVersion: "latest",
	},
	rules: {
		"linebreak-style": ["error", "unix"],
		quotes: ["error", "double"],
		semi: ["error", "never"],
	},
}
