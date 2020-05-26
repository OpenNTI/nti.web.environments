import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {navigate} from '@reach/router';
import {scoped} from '@nti/lib-locale';
import {Loading, Form, Hooks, Errors} from '@nti/web-commons';

import {Page, Text, Inputs, Button, Link} from '../../../common';
import {sendVerification, Session} from '../../../data';

import Styles from './SignUp.css';

const cx = classnames.bind(Styles);
const t = scoped('lms-onboarding.trial.parts.SignUp', {
	title: 'Sign Up',
	heading: 'Train your team with NextThought.',
	message: '14-Day Free Trial! No credit card required!',
	termsAndConditions: 'By signing up you agree to the <a href="https://docs.google.com/document/d/e/2PACX-1vRJd0Irh_YFX7Ci9irWLmqrEqddrxSLrDkrJMANlCqQAo-PrLznTjk4G0hfCsjxD8M21Vd54iQ1Rqbn/pub">terms of use</a> and <a href="https://docs.google.com/document/u/1/pub?id=1W9R8s1jIHWTp38gvacXOStsfmUz5TjyDYYy3CVJ2SmM">Privacy Policy.</a>',
	createAccount: 'Start my Free Trial!',
	recover: 'Already have a Trial Site?',
	name: {
		label: 'Full Name'
	},
	email: {
		label: 'Email'
	},
	organization: {
		label: 'Organization Name'
	},
	phone: {
		label: 'Phone'
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
			<Page.Content className={cx('signup', {saving})} containerClassName={cx('signup-container')}>
				<Text.Heading centered>{t('heading')}</Text.Heading>
				<Text.Paragraph centered>{t('message')}</Text.Paragraph>
				<Loading.Placeholder loading={Hooks.useResolver.isPending(initialValues)} fallback={(<Loading.Spinner.Large />)}>
					{saving && (
						<Loading.Spinner.Large />
					)}
					<div className={cx('container')}>
						<Form className={cx('signup-form')} onSubmit={onSubmit} disabled={!agreed} initialError={Errors.getErrorFromLocation(location)}>
							<Inputs.Text
								required
								autoFocus
								name="name"
								defaultValue={initialValues['name'] || '' }
								label={t('name.label')}
								underlined
								fill
							/>
							<Inputs.Email
								required
								name="email"
								defaultValue={initialValues['email'] || ''}
								label={t('email.label')}
								underlined
								fill
							/>
							<Inputs.Phone
								required
								name="phone"
								defaultValue={initialValues['phone'] || ''}
								label={t('phone.label')}
								underlined
								fill
							/>
							<Inputs.Text
								required
								name="organization"
								defaultValue={initialValues['organization'] || ''}
								label={t('organization.label')}
								underlined
								fill
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
