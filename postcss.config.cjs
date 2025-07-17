// postcss.config.cjs
/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},  // <-- Sits in for “tailwindcss” now
    autoprefixer: {},
  },
}
