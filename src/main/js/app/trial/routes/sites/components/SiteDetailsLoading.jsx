import React from 'react';
import classnames from 'classnames/bind';
import PropTypes from 'prop-types';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import { scoped } from '@nti/lib-locale';
import { Timer, Hooks } from '@nti/web-commons';

import { Text } from 'common';

import LoadingSVG from '../assets/LoadingSvg';

import Styles from './SiteDetailsLoading.css';

const {isPending} = Hooks.useResolver;

const cx = classnames.bind(Styles);
const t = scoped('lms-onboarding.trial.sites.components.SiteDetailsLoading', {
	heading: 'Hold Tight!',
	paragraph: 'We are getting everything just right.',
	subparagraph: 'This may take a moment...',
	button: 'Go to Your Site'
});

const Messages = [
	(<>We are getting everything just right. <br /> This may take a moment...</>)
];

SiteDetailsLoading.propTypes = {
	site: PropTypes.string,
	onFinished: PropTypes.func
};
export default function SiteDetailsLoading ({ site, onFinished }) {
	const ticks = Timer.useTicks(Timer.Second * 15);
	const messageIndex = ticks % Messages.length;
	const message = Messages[messageIndex] || Messages[0];


	const finished = Hooks.useResolver(async () => {
		await site.onceFinished();

		return true;
	}, [site]);

	const progress = isPending(finished) ? 90 : 100;

	return (
		<section>
			<LoadingSVG progress={progress} onFinished={onFinished} />
			<Text.Heading className={cx('heading')}>{t('heading')}</Text.Heading>
			<TransitionGroup className={cx('messages')}>
				<CSSTransition key={messageIndex} classNames="fade" timeout={500}>
					<Text.Paragraph className={cx('message')}>
						{message}
					</Text.Paragraph>
				</CSSTransition>
			</TransitionGroup>
			<img className={cx('logo')} src="/resources/images/nt-logo.svg" />
		</section>
	);
}
