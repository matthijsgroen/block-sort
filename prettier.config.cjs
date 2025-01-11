// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
module.exports = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  tailwindFunctions: ["clsx"],
  trailingComma: "none"
};
