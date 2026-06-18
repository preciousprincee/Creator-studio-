/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        cream: { 50:'#fdfaf5',100:'#faf4e8',200:'#f5ebd4',300:'#edd9b8' },
        terra: { 50:'#fef5f2',100:'#fce8df',200:'#f8cfc0',300:'#f0a98f',400:'#e07a5f',500:'#c95f43',600:'#a8432a',700:'#8a3320',800:'#6e2518',900:'#4f180e' },
        sage:  { 50:'#f2f7f4',100:'#e8f0eb',200:'#ccddd2',300:'#a4c4ae',400:'#6fa880',500:'#4a8a5d',600:'#326944' },
        sand:  { 100:'#f5f0e8',200:'#ede4d0',300:'#d9c9a8',400:'#c2a97a',500:'#a6884e' },
        ink:   { 200:'#ddd0bf',300:'#c4b09a',400:'#9e8872',500:'#7a6655',600:'#5c4d40',700:'#44392e',800:'#2e2720',900:'#1c1612' },
      },
      boxShadow: {
        'warm-sm': '0 1px 3px rgba(100,70,40,0.08),0 1px 2px rgba(100,70,40,0.06)',
        'warm': '0 4px 16px rgba(100,70,40,0.10),0 1px 4px rgba(100,70,40,0.06)',
        'warm-lg': '0 8px 32px rgba(100,70,40,0.12),0 2px 8px rgba(100,70,40,0.08)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.35s ease forwards',
        'bounce-soft': 'bounceSoft 1.4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: { from:{opacity:0,transform:'translateY(16px)'},to:{opacity:1,transform:'translateY(0)'} },
        fadeIn: { from:{opacity:0},to:{opacity:1} },
        bounceSoft: { '0%,100%':{transform:'translateY(0)'},'50%':{transform:'translateY(-4px)'} },
      },
    },
  },
  safelist: [
    { pattern: /^(bg|text|border|ring)-(terra|sage|sand|ink|cream)-(50|100|200|300|400|500|600|700|800|900)$/ },
  ],
  plugins: [],
}
