/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        sans:    ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        ink:  { 50:'#F6F7F9',100:'#E8EAF0',200:'#C9CDD8',300:'#9DA4B5',400:'#6C7591',500:'#4A5270',600:'#343C56',700:'#232940',800:'#161C2E',900:'#0D1117' },
        gold: { DEFAULT:'#C9A84C', light:'#E8C97A', dark:'#9A7A2E' },
        sage: { DEFAULT:'#4A7C59', light:'#6BA87A', dark:'#2E5038' },
        rose: { DEFAULT:'#C94A6A', light:'#E87A93', dark:'#8A2A45' },
      },
    },
  },
  plugins: [],
};
