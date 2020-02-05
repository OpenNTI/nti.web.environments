import React from 'react';
import {scoped} from '@nti/lib-locale';

import {Page, AuthRouter} from '../../common';
import {getCustomer} from '../../data';

import SignUp from './routes/SignUp';
import Recovery from './routes/Recovery';
import Verification from './routes/Verification';
import Sites from './routes/sites';

const t = scoped('lms-onboarding.trial.View', {
	title: 'Trial Site'
});

export default function NTIOnboardingTrial () {
	return (
		<Page.Title title={t('title')}>
			<AuthRouter getUser={getCustomer} shouldReload={getCustomer.hasCached}>
				<AuthRouter.PublicRoute path="/" entry component={SignUp} />
				<AuthRouter.PublicRoute path="verification" component={Verification} />
				<AuthRouter.PublicRoute path="recover" component={Recovery} />
				<AuthRouter.PrivateRoute path="sites/*" entry redirectPath="sites" component={Sites} />
			</AuthRouter>
		</Page.Title>
	);
}