import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {navigate} from '@reach/router';
import {scoped} from '@nti/lib-locale';
import {Form, Hooks, Loading} from '@nti/web-commons';

import {Page, Text, Inputs, Button, Link} from '../../../common';
import {sendVerification, Session} from '../../../data';

import Styles from './Recover.css';

const cx = classnames.bind(Styles);
const t = scoped('lms-onboarding.trial.creation.View', {
	title: 'Recover',
	heading: 'Welcome Back',
	message: 'Please provide your email to look up on going trials.',
	recover: 'Look Up Trials',
	signUp: 'Set up a trial',
	email: {
		placeholder: 'Email'
	}
});

LMSTrialRecovery.propTypes = {
	location: PropTypes.object
};
export default function LMSTrialRecovery ({location}) {
	const [saving, setSaving] = React.useState(false);

	const initialValues = Hooks.useResolver(() => {
		return Session.get() || {};
	}, [location]);

	const onSubmit = async ({json}) => {
		setSaving(true);

		try {
			const resp = await sendVerification(json);

			Session.set({...Session.get(), ...json, ...resp});
			navigate('verification');
		} catch (e) {
			setSaving(false);
			throw e;
		}
	};

	return (
		<Page title={t('title')}>
			<Page.Content className={cx('recover', {saving})}>
				<Text.Heading centered>{t('heading')}</Text.Heading>
				<Text.Paragraph centered>{t('message')}</Text.Paragraph>
				<Loading.Placeholder loading={Hooks.useResolver.isPending(initialValues)} fallback={(<Loading.Spinner.Large />)}>
					{saving && (
						<Loading.Spinner.Large />
					)}
					<div className={cx('container')}>
						<Form className={cx('recover-form')} onSubmit={onSubmit}>
							<Inputs.Email name="email" required placeholder={t('email.placeholder')} defaultValue={initialValues.email} autoFocus />
							<Button as={Form.SubmitButton}>
								<Text.Base white>{t('recover')}</Text.Base>
							</Button>
						</Form>
						<Link to="/" className={cx('sign-up-link')}>
							<Text.Base>{t('signUp')}</Text.Base>
						</Link>
					</div>
				</Loading.Placeholder>
			</Page.Content>
		</Page>
	);
}