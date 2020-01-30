import React from 'react';
import { Loading, Hooks } from '@nti/web-commons';
import classnames from 'classnames/bind';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';

import { Text } from 'common';

import LoadingSVG from '../assets/LoadingSvg';

import Styles from './SiteDetailsLoading.css';

const cx = classnames.bind(Styles);
const t = scoped('lms-onboarding.trial.sites.components.SiteDetailsLoading', {
	heading: 'Hold Tight!',
	paragraph: 'We are getting everything just right.',
	subparagraph: 'This may take a moment...',
	button: 'Go to Your Site'
});

SiteDetailsLoading.propTypes = {
	site: PropTypes.string,
	progress: PropTypes.number,
	onFinished: PropTypes.func
};

export default function SiteDetailsLoading ({ site, progress, onFinished }) {
	return (
		<Loading.Placeholder
			loading={Hooks.useResolver.isPending(site)}
			fallback={<Loading.Spinner.Large />}
		>
			<section>
				<LoadingSVG progress={progress} onFinished={onFinished} />
				<Text.Heading className={cx('heading')}>{t('heading')}</Text.Heading>
				<Text.Paragraph className={cx('paragraph')}>
					{t('paragraph')}
					<br></br>
					{t('subparagraph')}
				</Text.Paragraph>
				<img className={cx('logo')} src="/resources/images/nt-logo.svg" />
			</section>
		</Loading.Placeholder>
	);
}
