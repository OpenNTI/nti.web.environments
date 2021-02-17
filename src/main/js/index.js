import React from 'react';
import ReactDOM from 'react-dom';
import { initErrorReporter } from '@nti/web-client';

import App from './app';

initErrorReporter();

ReactDOM.render(React.createElement(App), document.getElementById('content'));
