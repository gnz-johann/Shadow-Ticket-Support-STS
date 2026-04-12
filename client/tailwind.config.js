/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        moss: {
          DEFAULT: '#2A3B32', // Verde musgo base
          light: '#4B6355',   // Verde musgo claro
          satin: '#183A26',   // Nuevo: Verde vibrante/satinado para contrastes
          deep: '#0F1C15',    // Nuevo: Verde casi negro para máxima profundidad
        },
        pastel: {
          green: '#DCE7E1',
        },
        beige: {
          DEFAULT: '#F5F2EA',
          dark: '#E3DBC8',
          accent: '#D4C4A8',
        }
      },
      fontFamily: {
        // Tipografías de Google Fonts
        heading: ['Montserrat', 'sans-serif'], // Títulos, Lema, Navbar
        body: ['Nunito', 'sans-serif'],        // Párrafos largos, lectura cómoda
        mono: ['Space Grotesk', 'monospace'],  // Precios, Código de Tickets (#TKT)
      }
    },
  },
  plugins: [],
}