import { handleErrorWithSentry, replayIntegration } from '@sentry/sveltekit';
import * as Sentry from '@sentry/sveltekit';

Sentry.init({
	dsn: 'https://b962a8eb337185ba3602a7dc324b2c47@o4508971907940352.ingest.us.sentry.io/4508971911020544',

	tracesSampleRate: 1.0,

	// This sets the sample rate to be 10%. You may want this to be 100% while
	// in development and sample at a lower rate in production
	replaysSessionSampleRate: 1.0,

	// If the entire session is not sampled, use the below sample rate to sample
	// sessions when an error occurs.
	replaysOnErrorSampleRate: 1.0,

	// If you don't want to use Session Replay, just remove the line below:
	integrations: [
		Sentry.replayCanvasIntegration ({
			maskAllText: false,
			maskAllInputs: false,
			blockAllMedia: false,
		}),
	],
});

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
