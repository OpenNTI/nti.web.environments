import React from 'react';
import {scoped} from '@nti/lib-locale';

import {Page} from '../../../common';

const t = scoped('lms-onboarding.trial.creation.View', {
	title: 'Recover'
});


export default function LMSTrialRecovery () {
	return (
		<Page.Title title={t('title')}>
			<div>
				LMS Trial Recovery
			</div>
		</Page.Title>
	);
}