import React from 'react';
import classnames from 'classnames/bind';
import { Button } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import { Text } from 'common';

import Styles from './SiteDetailsCompleted.css';

const cx = classnames.bind(Styles);
const t = scoped('lms-onboarding.trial.sites.components.SiteDetailsCompleted', {
	heading: 'Yay! You\'re site is ready to go!',
	paragraph: 'Continue to ',
	button: 'Go to Your Site'
});

export default function SiteDetailsCompleted () {
	return (
		<section className={cx('loading-complete')}>
			<Text.Heading className={cx('heading')}>{t('heading')}</Text.Heading>
			<Text.Paragraph className={cx('paragraph')}>
				{t('paragraph')}
			</Text.Paragraph>
			<Button rounded className={cx('continue-btn')}>{t('button')}</Button>
		</section>
	);
}
