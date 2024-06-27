import { nextui } from '@nextui-org/react';
import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      noteSans: ['Noto Sans JP', 'sans-serif'],
    },
    extend: {},
  },
  darkMode: 'class',
  plugins: [nextui()],
} satisfies Config;
