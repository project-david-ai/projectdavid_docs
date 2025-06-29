import defaultTheme from 'tailwindcss/defaultTheme';
import typography   from '@tailwindcss/typography';

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx,md}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Audiowide', 'sans-serif'],
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary:     '#6750A4',
        'on-primary':'#FFFFFF',
        surface:     '#FFFFFF',
        'on-surface':'#1C1B1F',
        secondary:   '#625B71',
        'on-secondary':'#FFFFFF',
        outline:     '#79747E',

        highlight:   '#111827',
        muted:       'rgba(28,27,31,0.85)',
      },
      borderRadius: {
        m3: '1rem',
      },
      boxShadow: {
        m3: '0 4px 8px rgba(0,0,0,0.15)',
      },
      /* 👉 docs-column width to match CodePanel (960 px) */
      maxWidth: {
        docs: '960px',
      },
    },
  },
  plugins: [
    typography,   // Tailwind Typography
  ],
};
