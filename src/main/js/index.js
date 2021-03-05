import React from 'react';
import ReactDOM from 'react-dom';
import { initErrorReporter } from '@nti/web-client';
import { init as initLocale } from '@nti/lib-locale';

import App from './app';

initLocale();

if (typeof document !== 'undefined') {
	initErrorReporter();

	ReactDOM.render(
		React.createElement(App),
		document.getElementById('content')
	);
}
