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
	termsAndConditions: 'By signing up you agree to the <a href="#">terms and conditions.</a>',
	createAccount: 'Create an Account',
	recover: 'Already have a Trial Site?',
	firstName: {
		placeholder: 'First Name'
	},
	lastName: {
		placeholder: 'Last Name'
	},
	email: {
		placeholder: 'Email'
	},
	orgName: {
		placeholder: 'Organization Name'
	}
});


function renderInput (name, initialValues, Cmp = Inputs.Text, autoFocus) {
	const getString = (key) => t(`${name}.${key}`);

	return (
		<Cmp name={name} required defaultValue={initialValues[name] || ''}  placeholder={getString('placeholder')} autoFocus={autoFocus} />
	);
}

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
							{renderInput('firstName', initialValues, Inputs.Text, true)}
							{renderInput('lastName', initialValues)}
							{renderInput('email', initialValues, Inputs.Email)}
							{renderInput('orgName', initialValues)}
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
