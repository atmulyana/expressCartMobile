// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
    {
        ignores: [
            "dist/*",
            "src/app/**/example*.tsx",
            'node_modules/**/*',
        ],
    },
    expoConfig,
    {
        rules: {
            "eqeqeq": "off",
            "no-unused-vars": "off",
            "react-hooks/set-state-in-effect": 'off',
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "_",
                    varsIgnorePattern: "_",
                    caughtErrorsIgnorePattern: "_",
                    destructuredArrayIgnorePattern: "_"
                }
            ]
        },
    }
]);
