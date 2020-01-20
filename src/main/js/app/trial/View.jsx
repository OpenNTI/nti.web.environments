import React from 'react';
import {scoped} from '@nti/lib-locale';

import {Page, AuthRouter} from '../../common';
import {isAuthenticated} from '../../data';

import SignUp from './parts/SignUp';
import Recovery from './parts/Recovery';
import Verification from './parts/Verification';
import Sites from './parts/Sites';

const t = scoped('lms-onboarding.trial.View', {
	title: 'Trial Site'
});

export default function NTIOnboardingTrial () {
	return (
		<Page.Title title={t('title')}>
			<AuthRouter isAuthenticated={isAuthenticated}>
				<AuthRouter.PublicRoute path="/" entry component={SignUp} />
				<AuthRouter.PublicRoute path="verification" component={Verification} />
				<AuthRouter.PublicRoute path="recover" component={Recovery} />
				<AuthRouter.PrivateRoute path="sites" entry component={Sites} />
			</AuthRouter>
		</Page.Title>
	);
}