/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1FA3D6",
        bg: "#F3FAFD",
        card: "#FFFFFF",
        muted: "#8A9BB0",
        badgeOrange: "#FFF2E5",
        badgeOrangeText: "#D9480F",
        badgeYellow: "#FFF8E1",
        badgeYellowText: "#C47F00",
      }
    }
  },
  plugins: [],
}
