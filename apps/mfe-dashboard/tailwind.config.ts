import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  prefix: 'db-',
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
