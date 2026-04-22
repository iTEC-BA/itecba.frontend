// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Combinación de colores para la web itec.ba
        "itec-bg": "#1A1A1A", // Fondo principal de la web itec.ba
        "itec-text": "#E5E6EA", // Texto principal
        "itec-accent": "#D41313", // Color de acento (rojo)
        "itec-primary": "#022A5E", // Color primario (azul oscuro)
        "itec-gray": "#474747", // Gris secundario

        // Azul principal aproximado del diseño
        itecBlue: {
          DEFAULT: "#3B82F6", // blue-500
          dark: "#2563EB", // blue-600
        },
        // Gris de fondo principal para el dashboard
        bgMain: "#F3F4F6", // gray-100
      },
      fontFamily: {
        // Asegúrate de usar una fuente sans-serif limpia como Inter o Roboto
        sans: ["Inter", "sans-serif"],
      },
      // Agregamos los Keyframes para las animaciones del Loading universal
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        blink: {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out forwards",
        blink: "blink 0.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
