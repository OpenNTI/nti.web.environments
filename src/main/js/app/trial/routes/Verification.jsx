import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Redirect, navigate} from '@reach/router';
import {scoped} from '@nti/lib-locale';
import {Loading, Form, Hooks, Errors} from '@nti/web-commons';

import {Page, Text, Link, Inputs} from '../../../common';
import {verifyToken, Session} from '../../../data';

import Styles from './Verification.css';

const cx = classnames.bind(Styles);
const t = scoped('lms-onboarding.trail.parts.Verification', {
	title: 'Verification',
	heading: 'Check your Email',
	sent: 'We\'ve sent a 6-digit information code to:',
	change: 'Not You? Click here',
	expires: 'It will expire shortly, so enter it soon.',
	keep: 'Keep this window open while checking for your code.',
	spam: 'Remember to try your spam folder!',
	check: 'Check Code'
});

const HasNonAlphaNumeric = /[^a-zA-Z0-9]/;
const preventInvalidCodes = (value, e) => {
	if (HasNonAlphaNumeric.test(value)) {
		e.stopPropagation();
		e.preventDefault();
	}
};

LMSTrialVerification.propTypes = {
	location: PropTypes.object	
};
export default function LMSTrialVerification ({location}) {
	const inflight = React.useRef(null);
	const [code, setCode] = React.useState(null);
	const [codeError, setCodeError] = React.useState(null);
	const [checking, setChecking] = React.useState(false);
	const showError = !checking && codeError;

	const sentTo = Hooks.useResolver(() => {
		//TODO: check the location for an id param that we can use to
		//look up info about where it was sent from the server
		const session = Session.get();

		if (!session || !session.email) {
			throw new Error('No sent to email');
		}

		return {
			email: session.email,
			'code_prefix': session.code_prefix
		};
	}, [location]);

	//If we can't figure out the sent info we can't submit this form
	if (Hooks.useResolver.isErrored(sentTo)) {
		return (
			<Redirect to="/" />
		);
	}

	const onChange = async ({json}) => {
		if (json.code.length > 6) { return; }

		setCode(json.code);
		setCodeError(null);
		setChecking(false);

		if (json.code.length < 6) { return; }

		try {
			inflight.current = json.code;
			setChecking(true);
			await verifyToken(json);

			if (inflight.current !== json.code) { return; }

			navigate('sites');
		} catch (e) {
			if (inflight.current === json.code) {
				setCodeError(e);
				setChecking(false);
			}
		}
	};

	return (
		<Page title={t('title')}>
			<Page.Content>
				<Text.Heading centered>{t('heading')}</Text.Heading>
				<Loading.Placeholder loading={Hooks.useResolver.isPending(sentTo)} fallback={(<Loading.Spinner.Large />)}>
					<div className={cx('verify-sent')}>
						<Text.Paragraph centered>{t('sent')}</Text.Paragraph>
						<Text.Paragraph centered><strong>{sentTo.email}</strong></Text.Paragraph>
						<Text.Small centered>
							<Link to="/">
								{t('change')}
							</Link>
						</Text.Small>
					</div>
					<Text.Paragraph centered>
						{t('expires')}
					</Text.Paragraph>
					<Form className={cx('verify-form', {'has-error': showError})} onChange={onChange}>
						<Inputs.Text type="hidden" name="email" value={sentTo.email} />
						<Inputs.Text type="hidden" name="code_prefix" value={sentTo.code_prefix} />
						<div className={cx('code-input')}>
							<Inputs.Code name="code" onChange={preventInvalidCodes} value={code} pattern="\d*" autoFocus />
							{checking && (
								<div className={cx('loading-container')}>
									<Loading.Spinner size="30px" blue />
								</div>
							)}
						</div>
						{showError && (
							<div className={cx('error-container', {show: checking || codeError})}>
								<Errors.Message error={codeError} />
							</div>
						)}
					</Form>
					<Text.Small as="p" centered light>{t('keep')}</Text.Small>
					<Text.Small as="p" centered light>{t('spam')}</Text.Small>
				</Loading.Placeholder>
			</Page.Content>
		</Page>
	);
}
