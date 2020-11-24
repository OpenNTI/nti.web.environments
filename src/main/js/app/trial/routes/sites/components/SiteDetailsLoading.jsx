import React, { useCallback } from 'react';
import classnames from 'classnames/bind';
import PropTypes from 'prop-types';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import { scoped } from '@nti/lib-locale';
import {rawContent} from '@nti/lib-commons';
import { Timer, Hooks } from '@nti/web-commons';

import { Text } from 'common';

import LoadingSVG from '../assets/LoadingSvg';

import Styles from './SiteDetailsLoading.css';

const {isPending} = Hooks.useResolver;

const cx = classnames.bind(Styles);
const t = scoped('lms-onboarding.trial.sites.components.SiteDetailsLoading', {
	heading: 'Hold Tight!',
	whileYouWait: 'While you wait &mdash; let\'s schedule a quick chat.',
	continue: 'Just let me try things out.'
});

const MeetingFormEmbed = `
<!-- Start of Meetings Embed Script -->
<div class="meetings-iframe-container" data-src="https://app.hubspot.com/meetings/max-bevan/nextthought-lms-demo-with-max?embed=true"></div>
<!-- End of Meetings Embed Script -->
`;

function embedMeetingScript () {
	if (!global.document || embedMeetingScript.script) { return; }

	const script = Object.assign(
		global.document.createElement('script'),
		{
			async: true,
			defer: true,
			charset: 'utf-8',
			type: 'text/javascript',
			src: 'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js'
		}
	);

	embedMeetingScript.script = script;
	document.body.appendChild(script);
}

SiteDetailsLoading.propTypes = {
	site: PropTypes.string,
	onFinished: PropTypes.func
};
export default function SiteDetailsLoading ({ site, onFinished }) {
	const [showForm, setShowForm] = React.useState(false);
	const [skipForm, setSkipForm] = React.useState(false);

	Timer.useWait(useCallback(() => setShowForm(true)), 2000);

	const finished = Hooks.useResolver(async () => {
		await site.onceFinished();

		return true;
	}, [site]);

	const progress = isPending(finished) ? 90 : 100;
	const doShowForm = !skipForm && showForm;

	const maybeLoadScript = (node) => node && embedMeetingScript();
	const onLoadingFinished = () => onFinished();
	const doSkipForm = () => isPending(finished) ? setSkipForm(true) : onFinished();

	return (
		<section className={cx('site-loading-details', {'show-form': doShowForm})}>
			<LoadingSVG progress={progress} className={cx('progress-bar')} onFinished={onLoadingFinished} />
			<div className={cx('form')}>
				<Text.Heading localized className={cx('heading')}>{t('whileYouWait')}</Text.Heading>
				<div className={'frame'} ref={maybeLoadScript} {...rawContent(MeetingFormEmbed)} />
			</div>
			<div className={cx('intro')}>
				<Text.Heading className={cx('heading')}>{t('heading')}</Text.Heading>
				<TransitionGroup className={cx('messages')}>
					<CSSTransition key="message" classNames="fade" timeout={500}>
						<Text.Paragraph className={cx('message')}>
							We are getting everything just right. <br /> This may take a moment...
						</Text.Paragraph>
					</CSSTransition>
				</TransitionGroup>
			</div>
			<Text.Base className={cx('continue')} onClick={doSkipForm}>{t('continue')}</Text.Base>
			<img className={cx('logo')} src="/resources/images/nt-logo.svg" />
		</section>
	);
}
