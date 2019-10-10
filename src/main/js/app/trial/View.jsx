import React from 'react';
import {Router} from '@reach/router';
import {scoped} from '@nti/lib-locale';

import {Page} from '../../common';

import Setup from './parts/Setup';
import Recovery from './parts/Recovery';

const t = scoped('lms-onboarding.trial.View', {
	title: 'Trial Site'
});

export default function NTIOnboardingTrial () {
	return (
		<Page.Title title={t('title')}>
			<Router>
				<Setup path="/" />
				<Recovery path="recover" />
			</Router>
		</Page.Title>
	);
}