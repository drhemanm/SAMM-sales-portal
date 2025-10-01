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
        // Apple-inspired color palette
        primary: {
          DEFAULT: '#007AFF', // iOS Blue
          50: '#E5F2FF',
          100: '#CCE5FF',
          200: '#99CCFF',
          300: '#66B2FF',
          400: '#3399FF',
          500: '#007AFF',
          600: '#0062CC',
          700: '#004999',
          800: '#003166',
          900: '#001833',
        },
        
        // Apple Neutral Grays (with warm undertones)
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F7',
          200: '#E8E8ED',
          300: '#D2D2D7',
          400: '#AEAEB2',
          500: '#8E8E93',
          600: '#636366',
          700: '#48484A',
          800: '#3A3A3C',
          900: '#1C1C1E',
        },

        // Apple System Colors
        success: {
          DEFAULT: '#34C759', // iOS Green
          light: '#30D158',
          dark: '#28A745',
        },

        warning: {
          DEFAULT: '#FF9F0A', // iOS Orange
          light: '#FFB340',
          dark: '#FF8C00',
        },

        error: {
          DEFAULT: '#FF3B30', // iOS Red
          light: '#FF6259',
          dark: '#E0301E',
        },

        info: {
          DEFAULT: '#007AFF', // iOS Blue
          light: '#5AC8FA',
          dark: '#0051D5',
        },

        // Apple Purple
        purple: {
          DEFAULT: '#AF52DE',
          light: '#BF5AF2',
          dark: '#9747BD',
        },

        // Apple Pink
        pink: {
          DEFAULT: '#FF2D55',
          light: '#FF375F',
          dark: '#D70015',
        },

        // Apple Teal
        teal: {
          DEFAULT: '#5AC8FA',
          light: '#64D2FF',
          dark: '#0099CC',
        },
      },
      
      fontFamily: {
        sans: [
          '-apple-system', 
          'BlinkMacSystemFont', 
          'SF Pro Display',
          'SF Pro Text',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ],
        display: [
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ],
        mono: [
          'SF Mono',
          'Monaco',
          'Consolas',
          'monospace'
        ],
      },

      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '28px',
        '4xl': '32px',
      },

      boxShadow: {
        // Apple-style shadows
        'xs': '0 1px 2px rgba(0, 0, 0, 0.04), 0 1px 1px rgba(0, 0, 0, 0.06)',
        'sm': '0 2px 4px rgba(0, 0, 0, 0.06), 0 2px 3px rgba(0, 0, 0, 0.08)',
        'DEFAULT': '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'md': '0 6px 12px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.06)',
        'lg': '0 12px 24px rgba(0, 0, 0, 0.09), 0 6px 12px rgba(0, 0, 0, 0.08)',
        'xl': '0 20px 40px rgba(0, 0, 0, 0.10), 0 10px 20px rgba(0, 0, 0, 0.08)',
        '2xl': '0 25px 50px rgba(0, 0, 0, 0.12), 0 15px 30px rgba(0, 0, 0, 0.10)',
        
        // Glass effects
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glass-lg': '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
        
        // Colored shadows
        'blue': '0 10px 30px rgba(0, 122, 255, 0.3)',
        'blue-lg': '0 20px 40px rgba(0, 122, 255, 0.4)',
        'purple': '0 10px 30px rgba(175, 82, 222, 0.3)',
        'pink': '0 10px 30px rgba(255, 45, 85, 0.3)',
        'teal': '0 10px 30px rgba(90, 200, 250, 0.3)',
      },

      backdropBlur: {
        xs: '2px',
        '3xl': '64px',
      },

      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },

      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
      },
    },
  },
  plugins: [],
}
