import React from 'react';
import {scoped} from '@nti/lib-locale';

import {Page, Text} from '../../../../../common';
import Image from '../assets/sites-image.png';

const t = scoped('lms-onboarding.trial.parts.SignUp', {
	title: 'Sites'
});

export default function LMSTrialSites () {
	return (
		<Page title={t('title')}>
			<Page.Content>
				<Text.Heading>Test</Text.Heading>
			</Page.Content>
			<Page.Image src={Image} fullscreen />
		</Page>
	);
}