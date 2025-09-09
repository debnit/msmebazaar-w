/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        body: ['System'],
        headline: ['System'],
        code: ['monospace'],
      },
      colors: {
        background: '#e8eaf0',
        foreground: '#1e2a4a',
        card: '#ffffff',
        'card-foreground': '#1e2a4a',
        popover: '#ffffff',
        'popover-foreground': '#1e2a4a',
        primary: '#1e2a4a',
        'primary-foreground': '#fafafa',
        secondary: '#d1d5db',
        'secondary-foreground': '#1e2a4a',
        muted: '#d1d5db',
        'muted-foreground': '#6b7280',
        accent: '#ff6b35',
        'accent-foreground': '#ffffff',
        destructive: '#ef4444',
        'destructive-foreground': '#fafafa',
        border: '#d1d5db',
        input: '#d1d5db',
        ring: '#ff6b35',
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
      },
    },
  },
  plugins: [],
}
