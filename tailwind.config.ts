import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import flowbitePlugin from 'flowbite/plugin';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],
	darkMode: 'selector',
	theme: {
		extend: {
			colors: {
				//flowbite-svelte
				primary: {
					50: '',
					100: '',
					200: '',
					300: '',
					400: '',
					500: '',
					600: '',
					700: '',
					800: '',
					900: '',
				}
			}
		}
	},

	plugins: [typography, forms, containerQueries, flowbitePlugin]
} satisfies Config;
