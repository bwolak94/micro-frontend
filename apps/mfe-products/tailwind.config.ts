import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,vue}'],
  darkMode: 'class',
  prefix: 'products-',
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
