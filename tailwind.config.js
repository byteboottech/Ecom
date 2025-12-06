/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    'whitespace-normal', 'whitespace-nowrap', 'break-words', 'overflow-wrap-anywhere',
    { pattern: /(sm|md|lg|xl):(whitespace-(normal|nowrap)|break-(words|normal|all))/ }
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
