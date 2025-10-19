/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/**/*.html', // Scan all HTML files in the public folder
  ],
  theme: {
    extend: {
      colors: {
        // HSL colors from the Design Guide
        'background': 'hsl(var(--background))',
        'background-secondary': 'hsl(var(--background-secondary))',
        'foreground': 'hsl(var(--foreground))',
        'primary': 'hsl(var(--primary))',
        'secondary': 'hsl(var(--secondary))',
        'accent': 'hsl(var(--accent))',
      },
      // Add custom font families if needed
      fontFamily: {
         // As per Design_Guide.md, 'Inter' is the main font
        'sans': ['Inter', 'sans-serif'],
      },
      // Custom glow effects
      boxShadow: {
        'glow-teal': '0 0 15px hsla(var(--primary), 0.5), 0 0 30px hsla(var(--primary), 0.3)',
        'glow-blue': '0 0 20px hsla(var(--secondary), 0.6)',
        'glow-yellow': '0 0 20px hsla(var(--accent), 0.5)',
      },
    },
  },
  plugins: [],
}