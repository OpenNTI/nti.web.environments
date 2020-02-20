import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {navigate} from '@reach/router';
import {scoped} from '@nti/lib-locale';
import {Loading, Form, Hooks} from '@nti/web-commons';

import {Page, Text, Inputs, Button, Link} from '../../../common';
import {sendVerification, Session} from '../../../data';

import Styles from './SignUp.css';

const cx = classnames.bind(Styles);
const t = scoped('lms-onboarding.trial.parts.SignUp', {
	title: 'Sign Up',
	heading: 'Welcome to NextThought',
	message: 'Complete your account details to get started.',
	termsAndConditions: 'By signing up you agree to the <a href="https://docs.google.com/document/u/1/pub?id=1rM40we-bbPNvq8xivEKhkoLE7wmIETmO4kerCYmtISM">terms of use</a> and <a href="https://docs.google.com/document/u/1/pub?id=1W9R8s1jIHWTp38gvacXOStsfmUz5TjyDYYy3CVJ2SmM">Privacy Policy.</a>',
	createAccount: 'Create an Account',
	recover: 'Already have a Trial Site?',
	name: {
		placeholder: 'Full Name'
	},
	email: {
		placeholder: 'Email'
	},
	organization: {
		placeholder: 'Organization Name'
	}
});


LMSTrailSignup.propTypes = {
	location: PropTypes.shape({
		search: PropTypes.string
	})
};
export default function LMSTrailSignup ({location}) {
	const [agreed, setAgreed] = React.useState(false);
	const [saving, setSaving] = React.useState(false);

	const initialValues = Hooks.useResolver(() => {
		//NOTE: this doesn't have to be async, originally this made
		//a server call to get some info. We'll keep it open to that
		//in the future.
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
			<Page.Content className={cx('signup', {saving})}>
				<Text.Heading centered>{t('heading')}</Text.Heading>
				<Text.Paragraph centered>{t('message')}</Text.Paragraph>
				<Loading.Placeholder loading={Hooks.useResolver.isPending(initialValues)} fallback={(<Loading.Spinner.Large />)}>
					{saving && (
						<Loading.Spinner.Large />
					)}
					<div className={cx('container')}>
						<Form className={cx('signup-form')} onSubmit={onSubmit} disabled={!agreed}>
							<Inputs.Text
								required
								autoFocus
								name="name"
								defaultValue={initialValues['name'] || '' }
								placeholder={t('name.placeholder')}
							/>
							<Inputs.Email
								required
								name="email"
								defaultValue={initialValues['email'] || ''}
								placeholder={t('email.placeholder')}
							/>
							<Inputs.Text
								required
								name="organization"
								defaultValue={initialValues['organization'] || ''}
								placeholder={t('organization.placeholder')}
							/>
							<Inputs.Checkbox
								required
								name="agreed"
								checked={agreed}
								label={(<Text.Small>{t('termsAndConditions')}</Text.Small>)}
								onChange={(e) => setAgreed(e.target.checked)}
							/>
							<Button as={Form.SubmitButton} fill>
								<Text.Base white>{t('createAccount')}</Text.Base>
							</Button>
						</Form>
						<Link to="recover" className={cx('recover-link')}>
							<Text.Base>{t('recover')}</Text.Base>
						</Link>
					</div>
				</Loading.Placeholder>
			</Page.Content>
		</Page>
	);
}
