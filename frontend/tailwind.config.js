/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Color - Simple Red
        primary: {
          DEFAULT: '#DC2626', // red-600
          light: '#EF4444',   // red-500
          dark: '#B91C1C',    // red-700
        },
        
        // Neutral Grays (Apple-style)
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },

        // Success - Simple Green
        success: {
          DEFAULT: '#10B981', // emerald-500
          light: '#34D399',   // emerald-400
          dark: '#059669',    // emerald-600
        },

        // Warning - Simple Orange
        warning: {
          DEFAULT: '#F59E0B', // amber-500
          light: '#FBBF24',   // amber-400
          dark: '#D97706',    // amber-600
        },

        // Error - Simple Red
        error: {
          DEFAULT: '#EF4444', // red-500
          light: '#F87171',   // red-400
          dark: '#DC2626',    // red-600
        },

        // Info - Simple Blue
        info: {
          DEFAULT: '#3B82F6', // blue-500
          light: '#60A5FA',   // blue-400
          dark: '#2563EB',    // blue-600
        },
      },
      
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'system-ui', 'sans-serif'],
        display: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'system-ui', 'sans-serif'],
      },

      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },

      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
