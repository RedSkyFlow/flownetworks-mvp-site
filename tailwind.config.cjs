module.exports = {
  content: [
    './public/**/*.html',
    './public/**/*.js',
    './scripts/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background) / <alpha-value>)',
        'background-secondary': 'hsl(var(--background-secondary) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        primary: 'hsl(var(--primary) / <alpha-value>)',
        secondary: 'hsl(var(--secondary) / <alpha-value>)',
        accent: 'hsl(var(--accent) / <alpha-value>)'
      }
    }
  },
  plugins: []
};
