/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        grisClaro: "#F7F8FA",
        textoPrincipal: "#333333",
        violetaPrincipal: "#6B21A8",
        rosaOscuro: "#B73A55",
        lilaClaro: "#BCA8F9",
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
};