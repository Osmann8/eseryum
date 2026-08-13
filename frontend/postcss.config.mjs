// Tailwind v4 kendi PostCSS eklentisiyle gelir; ayri bir tailwind.config.js yok,
// tema degiskenleri globals.css icindeki @theme blogunda tanimli.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
