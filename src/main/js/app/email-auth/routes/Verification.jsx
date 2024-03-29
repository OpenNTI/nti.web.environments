import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { Redirect, navigate } from '@reach/router';

import { scoped } from '@nti/lib-locale';
import { Loading, Form, Hooks } from '@nti/web-commons';
import { Page, Text, Link, Inputs } from 'internal/common';
import { verifyToken, Session } from 'internal/data';

import Styles from './Verification.css';

const cx = classnames.bind(Styles);
const t = scoped('lms-onboarding.trail.parts.Verification', {
	title: 'Verification',
	heading: 'Check your Email',
	sent: "We've sent a 6-digit information code to:",
	change: 'Edit',
	expires: 'It will expire shortly, so enter it soon.',
	keep: 'Keep this window open while checking for your code.',
	spam: 'Remember to try your spam folder!',
	check: 'Check Code',
	label: '6 Digit Code',
});

const HasNonAlphaNumeric = /[^a-zA-Z0-9]/;
const preventInvalidCodes = (value, e) => {
	if (HasNonAlphaNumeric.test(value)) {
		e.stopPropagation();
		e.preventDefault();
	}
};

const noop = () => {};

EmailVerification.propTypes = {
	location: PropTypes.object,
};
export default function EmailVerification({ location }) {
	const inflight = useRef(null);
	const [code, setCode] = useState(null);
	const [codeError, setCodeError] = useState(null);
	const [checking, setChecking] = useState(false);
	const showError = !checking && codeError;

	const sentTo = Hooks.useResolver(() => {
		//TODO: check the location for an id param that we can use to
		//look up info about where it was sent from the server
		const session = Session.get('nti-onboarding-email-auth');

		if (!session || !session.email) {
			throw new Error('No sent to email');
		}

		return {
			email: session.email,
			code_prefix: session.code_prefix,
			returnUrl: session.returnUrl,
		};
	}, [location]);

	// If we can't figure out the sent info we can't submit this form
	if (Hooks.useResolver.isErrored(sentTo)) {
		return <Redirect to="/email-auth/" />;
	}

	const onChange = async ({ json }) => {
		if (json.code.length > 6) {
			return;
		}

		setCode(json.code.toUpperCase());
		setCodeError(null);
		setChecking(false);

		if (json.code.length < 6) {
			return;
		}

		try {
			inflight.current = json.code;
			setChecking(true);

			await verifyToken(json, '/onboarding/@@login.email.verify');

			if (inflight.current !== json.code) {
				return;
			}

			if (json.returnUrl) {
				window.location = json.returnUrl;
			} else {
				navigate('/');
			}
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
				<Loading.Placeholder
					loading={Hooks.useResolver.isPending(sentTo)}
					fallback={<Loading.Spinner.Large />}
				>
					<div className={cx('verify-sent')}>
						<Text.Paragraph centered>{t('sent')}</Text.Paragraph>
						<Text.Paragraph centered>
							<strong>{sentTo.email}</strong>{' '}
							<Link className={cx('change')} to="/email-auth/">
								{t('change')}
							</Link>
						</Text.Paragraph>
					</div>
					<Text.Paragraph centered>{t('expires')}</Text.Paragraph>
					<Form
						className={cx('verify-form', {
							'has-error': showError,
						})}
						onChange={onChange}
						onSubmit={noop}
					>
						<Inputs.Hidden name="email" value={sentTo.email} />
						<Inputs.Hidden
							name="returnUrl"
							value={sentTo.returnUrl}
						/>
						<Inputs.Hidden
							name="code_prefix"
							value={sentTo.code_prefix}
						/>
						<div className={cx('code-input')}>
							<Inputs.Code
								name="code"
								onChange={preventInvalidCodes}
								value={code}
								autoFocus
								pattern="[a-zA-Z0-9]{6}"
								title="6 letters or numbers"
								label={t('label')}
								error={showError ? codeError : null}
								locked
								center
							/>
							{checking && (
								<div className={cx('loading-container')}>
									<Loading.Spinner size="30px" blue />
								</div>
							)}
						</div>
					</Form>
					<Text.Small as="p" centered light>
						{t('keep')}
					</Text.Small>
					<Text.Small as="p" centered light>
						{t('spam')}
					</Text.Small>
				</Loading.Placeholder>
			</Page.Content>
		</Page>
	);
}
