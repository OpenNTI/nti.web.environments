import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { navigate } from '@reach/router';

import { scoped } from '@nti/lib-locale';
import { Loading, Form, Hooks, Errors } from '@nti/web-commons';
import { Page, Text, Inputs, Button } from 'internal/common';
import { sendVerification, Session } from 'internal/data';

import Styles from './Form.css';

const cx = classnames.bind(Styles);
const t = scoped('lms-onboarding.email-auth.parts.Form', {
	title: 'Verify Email',
	heading: 'Confirm your email.',
	message: 'First we need to verify your email address.',
	createAccount: 'Verify my email!',
	email: {
		label: 'Email',
	},
});

EmailAuthForm.propTypes = {
	location: PropTypes.shape({
		search: PropTypes.string,
		href: PropTypes.string,
	}),
};
export default function EmailAuthForm({ location }) {
	const [saving, setSaving] = React.useState(false);

	const initialValues = Hooks.useResolver(() => {
		//NOTE: this doesn't have to be async, originally this made
		//a server call to get some info. We'll keep it open to that
		//in the future.
		const values = Session.get('nti-onboarding-email-auth') || {};
		const url = new URL(location.href);
		const redirectParam = url.searchParams.get('return');
		values.returnUrl = redirectParam;
		return values;
	}, [location]);

	const onSubmit = async ({ json }) => {
		setSaving(true);

		try {
			const resp = await sendVerification(
				json,
				'/onboarding/@@login.email'
			);

			Session.set(
				{
					...Session.get('nti-onboarding-email-auth'),
					...json,
					...resp,
				},
				'nti-onboarding-email-auth'
			);
			navigate('/email-auth/verification');
		} catch (e) {
			setSaving(false);
			throw e;
		}
	};

	return (
		<Page title={t('title')}>
			<Page.Content
				className={cx('signup', { saving })}
				containerClassName={cx('signup-container')}
			>
				<Text.Heading centered>{t('heading')}</Text.Heading>
				<Text.Paragraph centered>{t('message')}</Text.Paragraph>
				<Loading.Placeholder
					loading={Hooks.useResolver.isPending(initialValues)}
					fallback={<Loading.Spinner.Large />}
				>
					{saving && <Loading.Spinner.Large />}
					<div className={cx('container')}>
						<Form
							className={cx('signup-form')}
							onSubmit={onSubmit}
							initialError={Errors.getErrorFromLocation(location)}
						>
							<Inputs.Email
								required
								name="email"
								defaultValue={initialValues['email'] || ''}
								label={t('email.label')}
								underlined
								fill
							/>
							<Inputs.Hidden
								name="returnUrl"
								defaultValue={initialValues['returnUrl'] || ''}
							/>

							<Button as={Form.SubmitButton} fill>
								<Text.Base white>
									{t('createAccount')}
								</Text.Base>
							</Button>
						</Form>
					</div>
				</Loading.Placeholder>
			</Page.Content>
		</Page>
	);
}
