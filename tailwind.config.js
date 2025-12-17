/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1FA3D6",
        bg: "#F3FAFD",
        card: "#FFFFFF",
        muted: "#8A9BB0",
      },
    },
  },
  plugins: [],
};
