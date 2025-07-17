// postcss.config.cjs
/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: {
    // <-- New package instead of `tailwindcss`
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
