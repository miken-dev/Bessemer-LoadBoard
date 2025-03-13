import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import { PB } from '$lib/server/server';

Sentry.init({
	dsn: 'https://566b2c1b427feed92700e572c71e1179@o4508971907940352.ingest.us.sentry.io/4508971911020544',
	tracesSampleRate: 1
});

export const handle = sequence(Sentry.sentryHandle(), async ({ event, resolve }) => {
	event.locals.pb = PB;
	const response = await resolve(event);
	return response;
});

// read cookie
export const handleError = Sentry.handleErrorWithSentry();
