import type { Config } from "tailwindcss";

export default {
	content: ["./app/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				background: {
					DEFAULT: "hsl(var(--background))",
					menu: "hsl(var(--background-menu))",
				},
				foreground: "hsl(var(--foreground))",
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				success: {
					DEFAULT: "hsl(var(--success))",
					foreground: "hsl(var(--success-foreground))",
				},
				alt: {
					DEFAULT: "hsl(var(--alt))",
					foreground: "hsl(var(--alt-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				midnight: {
					1: "hsl(var(--midnight-1))",
					2: "hsl(var(--midnight-2))",
					3: "hsl(var(--midnight-3))",
					4: "hsl(var(--midnight-4))",
					5: "hsl(var(--midnight-5))",
				},
				ring: "hsl(var(--ring))",
				input: "hsl(var(--input))",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
