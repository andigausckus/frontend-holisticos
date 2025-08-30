module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        grisClaro: "#F7F8FA",
        textoPrincipal: "#444444", // gris suave
        violetaPrincipal: "#6B21A8",
        rosaOscuro: "#B73A55",
        lilaClaro: "#BCA8F9",
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
};