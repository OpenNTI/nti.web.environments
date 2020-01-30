import React from 'react';
import classnames from 'classnames/bind';
import { Button } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';
import confetti from 'canvas-confetti';

import { Text } from 'common';

import Styles from './SiteDetailsCompleted.css';

const cx = classnames.bind(Styles);
const t = scoped('lms-onboarding.trial.sites.components.SiteDetailsCompleted', {
	heading: 'Yay! Your site is ready to go!',
	paragraph: 'Continue to ',
	button: 'Go to Your Site'
});

export default function SiteDetailsCompleted () {
	React.useEffect(() => {
		confetti({
			particleCount: 125,
			spread: 100,
			origin: {
				y: 0.65
			},
			colors: ['#3fb34f','#629968','#8AC691','#BFE2DF','#FACB57','#13374D']
		});
	}, []);


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
