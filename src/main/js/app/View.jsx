import { Router } from '@reach/router';

import '@nti/style-common/all.scss';
import '@nti/style-common/variables.css';
import './View.css';

import EmailAuth from './email-auth';
import Trial from './trial';

export default function NTIOnboardingApp() {
	return (
		<Router>
			<EmailAuth path="/email-auth/*" />
			<Trial path="/*" />
		</Router>
	);
}
