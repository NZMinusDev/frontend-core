module.exports = {
  /**
   * Alternative to "Espree" parser that can read Typescript code and produce said ESTree(the language ESLint can understand)
   */
  parser: "@typescript-eslint/parser",
  extends: [
    // List of recommended rules by https://github.com/iamturns/eslint-config-airbnb-typescript
    "airbnb-base",
    "plugin:sonarjs/recommended", // detect bugs and suspicious patterns in your code (huge unreadable blocks of code)
    "plugin:no-use-extend-native/recommended", // prevent use of extended native objects
    /**
     * List of recommended rules for TypeScript from "@typescript-eslint" plugin
     */
    "plugin:@typescript-eslint/recommended",
    /**
     * Enables (eslint-plugin-prettier), which run Prettier analysis as part of ESLint.
     * Disable any linting rule that might interfere with an existing Prettier rule using(eslint-config-prettier).
     * Should be last for override other configs.
     */
    "plugin:prettier/recommended",
  ],
  plugins: ["no-loops", "promise", "lit"],
  rules: {
    "no-loops/no-loops": 2, // Disallow use of loops (for, for-in, while, do-while, for-of) - we have forEach, map etc.
    /**
     * Enforce best practices for JavaScript promises.
     */
    "promise/always-return": "error",
    "promise/no-return-wrap": "error",
    "promise/param-names": "error",
    "promise/catch-or-return": "error",
    "promise/no-native": "off",
    "promise/no-nesting": "warn",
    "promise/no-promise-in-callback": "warn",
    "promise/no-callback-in-promise": "warn",
    "promise/avoid-new": "warn",
    "promise/no-new-statics": "error",
    "promise/no-return-in-finally": "warn",
    "promise/valid-params": "warn",
    "lit/rule-name": "error"
  },
};
