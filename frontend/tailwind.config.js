/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#000000",
        slate: {
          DEFAULT: "#34434E",
          50: "#EEF0F2",
          100: "#D8DCE0",
          200: "#B2BAC1",
          300: "#8B97A2",
          400: "#647583",
          500: "#34434E",
          600: "#2A363F",
          700: "#1F2830",
          800: "#151B20",
          900: "#0A0D10",
        },
        steel: "#808080",
        mist: "#D3D3D3",
        paper: "#FFFFFF",
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
