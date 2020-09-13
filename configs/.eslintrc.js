module.exports = {
  /**
   * Alternative to "Espree" parser that can read Typescript code and produce said ESTree(the language ESLint can understand)
   */
  parser: "@typescript-eslint/parser",
  extends: [
    /**
     * List of recommended rules for TypeScript from "@typescript-eslint" plugin
     */
    "plugin:@typescript-eslint/recommended",
    /**
     * Disable any linting rule that might interfere with an existing Prettier rule using(eslint-config-prettier).
     * Enables (eslint-plugin-prettier), which run Prettier analysis as part of ESLint.
     * Should be last for override other configs.
     */
    "plugin:prettier/recommended",
  ],
};
