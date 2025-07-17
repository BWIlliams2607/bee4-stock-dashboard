// postcss.config.cjs
/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: [
    "@tailwindcss/postcss",  // plugin name as string
    "autoprefixer"           // plugin name as string
  ],
};
