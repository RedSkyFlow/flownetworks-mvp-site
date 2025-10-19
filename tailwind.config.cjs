/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/**/*.html',
    './public/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        // Updated to use the HSL variables from your new Brand Guide
        'background': 'hsl(var(--background) / <alpha-value>)',
        'background-secondary': 'hsl(var(--background-secondary) / <alpha-value>)',
        'foreground': 'hsl(var(--foreground) / <alpha-value>)',
        'primary': 'hsl(var(--primary) / <alpha-value>)',
        'secondary': 'hsl(var(--secondary) / <alpha-value>)',
        'accent': 'hsl(var(--accent) / <alpha-value>)',
      },
      // Extended box-shadows to match the custom glows in input.css
      boxShadow: {
        'glow-teal': 'var(--glow-teal)',
        'glow-blue': 'var(--glow-blue)',
        'glow-yellow': 'var(--glow-yellow)',
      },
      // Extended keyframes to include the new float animation
      animation: {
        'float': 'float 12s infinite alternate ease-in-out',
        'float-delay': 'float 10s infinite alternate ease-in-out -4s', // Delayed version
      },
      keyframes: {
        float: {
          '0%': { transform: 'translate(0px, 0px) scale(1)', opacity: 0.08 },
          '50%': { transform: 'translate(20px, 15px) scale(1.1)', opacity: 0.12 },
          '100%': { transform: 'translate(0px, 0px) scale(1)', opacity: 0.08 },
        },
      }
    },
  },
  plugins: [],
};