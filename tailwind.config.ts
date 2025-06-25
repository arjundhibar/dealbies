import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", 
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        averta: ['Averta CY', 'Helvetica Neue', 'Helvetica', 'Arial', 'Lucida Grande', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        dealhunter: {
          red: "#f7641b",
          redHover: "#eb611f",
          blue: "#0062e0",
          gray: "#f5f5f5",
          "dark-gray": "#666666",
          "light-gray": "#f9f9f9",
          "border-gray": "#e5e5e5",
        },
        dark: {
          primary: "#000",
          secondary: "#1d1f20",
          tertiary: "#28292a",
        },
        vote: {
          blue: "#005498",
          yellow: "#f3a21c",
          lightOrange: "#f7641b",
          lightRed: "#f03648",
          red: "#ce1734",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        'bounce-custom': {
          '0%, 100%': { transform: 'translateY(5px)' },
          '50%': { transform: 'translateY(0)' },
        },
        'voucher-tilt': {
          '0%, 100%': { transform: 'rotate(0)' },
          '50%': { transform: 'rotate(-25deg)' },
        },
        'voucher-tilt-reverse': {
          '0%, 100%': { transform: 'rotate(0)' },
          '50%': { transform: 'rotate(25deg)' },
        },
        'discussion-bounce': {
          '0%, 100%': { transform: 'translateY(5px)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'bounce-custom': 'bounce-custom 3s cubic-bezier(.5,0,.5,1) infinite normal forwards',
        'voucher-tilt': 'voucher-tilt 3s cubic-bezier(.5,0,.5,1) infinite normal forwards',
        'voucher-tilt-reverse': 'voucher-tilt-reverse 3s cubic-bezier(.5,0,.5,1) infinite normal forwards',
        'discussion-bounce': 'discussion-bounce 3s cubic-bezier(.5,0,.5,1) infinite normal forwards',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
