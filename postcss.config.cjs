// postcss.config.cjs
/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: {
    tailwindcss: {},    // use the core plugin directly
    autoprefixer: {},
  },
}
