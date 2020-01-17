import React from 'react';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {Form} from '@nti/web-commons';

import {Page, Text, Inputs, Button, Link} from '../../../common';

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


export default function LMSTrialRecovery () {
	
	const onSubmit = () => {

	};

	return (
		<Page title={t('title')}>
			<Page.Content>
				<Text.Heading centered>{t('heading')}</Text.Heading>
				<Text.Paragraph centered>{t('message')}</Text.Paragraph>
				<div className={cx('container')}>
					<Form className={cx('recover-form')} onSubmit={onSubmit}>
						<Inputs.Email name="email" placeholder={t('email.placeholder')} />
						<Button as={Form.SubmitButton}>
							<Text.Base white>{t('recover')}</Text.Base>
						</Button>
					</Form>
					<Link to="/" className={cx('sign-up-link')}>
						<Text.Base>{t('signUp')}</Text.Base>
					</Link>
				</div>
			</Page.Content>
		</Page>
	);
}