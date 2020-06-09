import React from 'react';
import {Router} from '@reach/router';

import Form from './routes/Form';
import Verification from './routes/Verification';

export default function NTIOnboardingEmailAuth () {
	return (
		<Router>
			<Verification path="verification" />
			<Form path="/" />
		</Router>
	);
}