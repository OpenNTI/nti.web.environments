import React from 'react';
import {Link} from '@reach/router';
import {scoped} from '@nti/lib-locale';

import {Page} from '../../../common';

const t = scoped('lms-onboarding.trial.parts.Setup', {
	title: 'Setup'
});

export default function LMSTrialCreation () {
	return (
		<Page.Title title={t('title')}>
			<Page.Content>
				Trial Creation
				<Link to="recover">
					Already have a Trial Site?
				</Link>
			</Page.Content>
		</Page.Title>
	);
}