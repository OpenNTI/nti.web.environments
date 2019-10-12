import React from 'react';
import {Router} from '@reach/router';
import {scoped} from '@nti/lib-locale';

import {Page} from '../../common';

import SignUp from './parts/SignUp';
import Recovery from './parts/Recovery';
import Verification from './parts/Verification';
import Setup from './parts/Setup';

const t = scoped('lms-onboarding.trial.View', {
	title: 'Trial Site'
});

export default function NTIOnboardingTrial () {
	return (
		<Page.Title title={t('title')}>
			<Router>
				<SignUp path="/" />
				<Verification path="verification" />
				<Setup path="setup" />
				<Recovery path="recover" />
			</Router>
		</Page.Title>
	);
}