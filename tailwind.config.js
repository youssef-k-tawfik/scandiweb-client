/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5ECE7B",
        // secondary: {
        //   100: "#E2E2D5",
        //   200: "#888883",
        // },
        mainFontColor: "#1D1F22",
      },
      fontFamily: {
        raleway: ["Raleway", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        robotoCondensed: ['"Roboto Condensed"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
