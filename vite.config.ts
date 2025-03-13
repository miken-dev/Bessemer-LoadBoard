import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sentrySvelteKit({
			sourceMapsUploadOptions: {
				org: 'dennison-creative',
				project: 'javascript-sveltekit'
			}
		}),
		sveltekit()
	],
	server: {
		host: true
	}
});
