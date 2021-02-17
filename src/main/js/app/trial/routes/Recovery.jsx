import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { scoped } from '@nti/lib-locale';
import { Form, Hooks, Loading, Errors } from '@nti/web-commons';

import { Page, Text, Inputs, Button, Link } from '../../../common';
import { sendRecovery, Session } from '../../../data';

import Styles from './Recover.css';

const cx = classnames.bind(Styles);
const t = scoped('lms-onboarding.trial.creation.View', {
	title: 'Recover',
	heading: 'Welcome Back',
	message: 'Please provide your email to look up ongoing trials.',
	recover: 'Look Up Trials',
	signUp: 'Set up a trial',
	email: {
		placeholder: 'Email',
	},
	sentTo: 'A recovery email has been sent to:',
	edit: 'Edit',
});

LMSTrialRecovery.propTypes = {
	location: PropTypes.object,
};
export default function LMSTrialRecovery({ location }) {
	const [saving, setSaving] = React.useState(false);
	const [sentTo, setSentTo] = React.useState(null);

	const initialValues = Hooks.useResolver(() => {
		return Session.get() || {};
	}, [location]);

	const onSubmit = async ({ json }) => {
		setSaving(true);

		try {
			await sendRecovery(json);

			setSentTo(json.email);
			setSaving(false);
		} catch (e) {
			setSaving(false);
			throw e;
		}
	};

	const clearSentTo = e => {
		e.preventDefault();
		setSentTo(null);
	};

	return (
		<Page title={t('title')}>
			<Page.Content className={cx('recover', { saving })}>
				<Text.Heading centered>{t('heading')}</Text.Heading>
				{sentTo && (
					<Text.Paragraph centered>{t('sentTo')}</Text.Paragraph>
				)}
				{!sentTo && (
					<Text.Paragraph centered>{t('message')}</Text.Paragraph>
				)}
				{sentTo && (
					<div className={cx('sent-to')}>
						<Text.Paragraph centered>
							<strong>{sentTo}</strong>{' '}
							<a href="#" onClick={clearSentTo}>
								{t('edit')}
							</a>
						</Text.Paragraph>
					</div>
				)}
				{!sentTo && (
					<Loading.Placeholder
						loading={Hooks.useResolver.isPending(initialValues)}
						fallback={<Loading.Spinner.Large />}
					>
						{saving && <Loading.Spinner.Large />}
						<div className={cx('container')}>
							<Form
								className={cx('recover-form')}
								onSubmit={onSubmit}
								initialError={Errors.getErrorFromLocation(
									location
								)}
							>
								<Inputs.Email
									name="email"
									required
									placeholder={t('email.placeholder')}
									defaultValue={initialValues.email}
									autoFocus
								/>
								<Button as={Form.SubmitButton} fill>
									<Text.Base white>{t('recover')}</Text.Base>
								</Button>
							</Form>
							<Link to="/" className={cx('sign-up-link')}>
								<Text.Base>{t('signUp')}</Text.Base>
							</Link>
						</div>
					</Loading.Placeholder>
				)}
			</Page.Content>
		</Page>
	);
}
