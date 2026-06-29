/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: "#101820",
          red: "#E10600",
          blue: "#0057FF",
          gold: "#FFB000",
          green: "#00875A"
        }
      },
      fontFamily: {
        display: ["Bebas Neue", "Impact", "sans-serif"],
        headline: ["Oswald", "Arial Narrow", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Georgia", "serif"]
      },
      boxShadow: {
        editorial: "0 18px 50px rgba(16, 24, 32, 0.12)"
      }
    }
  },
  plugins: []
};
