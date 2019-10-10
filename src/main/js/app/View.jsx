import React from 'react';
import {Router} from '@reach/router';

import '@nti/style-common/variables.css';
import './View.css';

import Trial from './trial';

export default function NTIOnboardingApp () {
	return (
		<Router>
			<Trial path="/*" />
		</Router>
	);
}

