import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ["**/*.{js,mjs,cjs,ts}"] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            "spaced-comment": 0,
            "comma-dangle": ["error", {
                "arrays": "always-multiline",
                "objects": "always-multiline",
                "imports": "always-multiline",
                "exports": "always-multiline",
                "functions": "never",
            }],
            "object-shorthand": ["error", "always", { "avoidExplicitReturnArrows": true }],
            "padding-line-between-statements": [
                "error",
                { "blankLine": "always", "prev": "*", "next": "return" },
                { "blankLine": "never", "prev": "empty", "next": "return" },
                { "blankLine": "always", "prev": "*", "next": "function" },
                { "blankLine": "never", "prev": "empty", "next": "function" },
            ],
            "lines-between-class-members": ["error", "always"],
            "arrow-parens": ["error", "always"],
            "no-else-return": "warn",
            "object-curly-spacing": ["error", "always"],

            // typescript rules
            "@typescript-eslint/array-type": ["error", {"default": "array-simple", "readonly": "array-simple"}],
            "@typescript-eslint/class-literal-property-style": ["error", "fields"],
            "@typescript-eslint/explicit-member-accessibility": ["warn", {"accessibility": "no-public"}],
            "@typescript-eslint/member-delimiter-style": ["error", {
                "multiline": {
                    "delimiter": "none",
                    "requireLast": true
                },
                "singleline": {
                    "delimiter": "semi",
                    "requireLast": false
                },
                "multilineDetection": "brackets"
            }],
            "@typescript-eslint/member-ordering": ["error", {
                "classes": [
                    "public-static-field",
                    "protected-static-field",
                    "private-static-field",
            
                    "public-static-method",
                    "protected-static-method",
                    "private-static-method",
            
                    "protected-instance-field",
                    "public-instance-field",
                    "private-instance-field",
            
                    "constructor",
            
                    "public-instance-method",
                    "protected-instance-method",
                    "private-instance-method"
                ]
            }],
            "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
            "@typescript-eslint/prefer-for-of": ["warn"],
            "@typescript-eslint/no-var-requires": ["off"]
        },
    },
];