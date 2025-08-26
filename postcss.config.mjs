/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},

    // Add modern CSS features like clamp()
    "postcss-preset-env": {
      stage: 0,
      features: {
        "clamp": true,
      },
    },
  },
  
};

export default config;