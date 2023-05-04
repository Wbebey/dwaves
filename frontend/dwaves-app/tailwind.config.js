/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        xxs: ['0.625rem', '0.75rem'],
        xxxs: ['0.5rem', '0.5rem']
      },
      screens: {
        ms: '320px',
        mm: '375px',
        ml: '425px',
      },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/colors/themes')['[data-theme=light]'],
          ...require('./dwaves.theme'),
        },
      },
      {
        dark: {
          ...require('daisyui/src/colors/themes')['[data-theme=dark]'],
          ...require('./dwaves.theme'),
        },
      },
    ],
  },

  plugins: [require("daisyui")],
}
