import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import { PB } from '$lib/server/server';

Sentry.init({
	dsn: 'https://add9301487d2ac52572466bff780824b@o4508971907940352.ingest.us.sentry.io/4509437733240832',
	tracesSampleRate: 1,
	replaysSessionSampleRate: 1.0,
	replaysOnErrorSampleRate: 1.0,
	profilesSampleRate: 1.0
});

export const handle = sequence(Sentry.sentryHandle(), async ({ event, resolve }) => {
	event.locals.pb = PB;
	const response = await resolve(event);
	return response;
});

// read cookie
export const handleError = Sentry.handleErrorWithSentry();
