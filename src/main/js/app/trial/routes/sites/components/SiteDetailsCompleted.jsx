import { useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import confetti from 'canvas-confetti';

import { Button } from '@nti/web-core';
import { scoped } from '@nti/lib-locale';
import { Text } from 'internal/common';

import Styles from './SiteDetailsCompleted.css';

const cx = classnames.bind(Styles);
const t = scoped('lms-onboarding.trial.sites.components.SiteDetailsCompleted', {
	success: {
		heading: 'Yay! Your site is ready to go!',
		paragraph: 'Continue to %(domain)s',
		button: 'Go to Your Site',
	},
	failure: {
		heading:
			"Yikes! It looks like we've hit a bit of a snag setting up your site.",
		paragraph:
			"Don't worry—our world-class support team has been notified of the issue and will connect with you via email to resolve the problem.",
		button: 'Contact Support',
	},
});

SiteDetailsCompleted.propTypes = {
	site: PropTypes.object.isRequired,
};

const supportEmail = 'support@nextthought.com?subject=Unable to set up site';

export default function SiteDetailsCompleted({ site }) {
	let state;
	if (site.isSuccess) {
		useEffect(() => {
			confetti({
				particleCount: 125,
				spread: 100,
				origin: {
					y: 0.65,
				},
				colors: [
					'#3fb34f',
					'#629968',
					'#8AC691',
					'#BFE2DF',
					'#FACB57',
					'#13374D',
				],
			});
		}, []);
		state = 'success';
	} else if (site.isFailure) {
		state = 'failure';
	}

	return (
		<section className={cx('loading-complete')}>
			{site.isFailure ? (
				<img
					src="/resources/images/illo-page-not-found.svg"
					className={cx('responsive')}
				></img>
			) : (
				<div className={cx('success-spacer')} />
			)}
			<Text.Heading className={cx('heading')}>
				{t(`${state}.heading`)}
			</Text.Heading>
			<Text.Paragraph className={cx('paragraph')}>
				{t(`${state}.paragraph`, { domain: site.domain || '' })}
			</Text.Paragraph>
			<Button
				rounded
				className={cx('continue-btn')}
				href={
					site.isFailure
						? `mailto:${supportEmail}`
						: site.continueLink
				}
			>
				{t(`${state}.button`)}
			</Button>
		</section>
	);
}
