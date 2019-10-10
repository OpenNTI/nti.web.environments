import querystring from 'querystring';

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {Input, Checkbox} from '@nti/web-commons';

import {Page, Text, Form, Button, Link} from '../../../common';

import Styles from './SignUp.css';

const cx = classnames.bind(Styles);
const t = scoped('lms-onboarding.trial.parts.SignUp', {
	title: 'Sign Up',
	heading: 'Welcome to NextThought',
	message: 'Complete your account details to get started.',
	termsAndConditions: 'By signing up you agree to the <a href="#">terms and conditions.</a>',
	createAccount: 'Create an Account',
	firstName: {
		placeholder: 'First Name'
	},
	lastName: {
		placeholder: 'Last Name'
	},
	email: {
		placeholder: 'Email'
	},
	userName: {
		placeholder: 'Username'
	}
});

export default class LMSTrialSignup extends React.Component {
	static propTypes = {
		location: PropTypes.shape({
			search: PropTypes.string
		})
	};

	state = {agreed: false}

	onAgreeChanged = (e) => {
		this.setState({
			agreed: e.target.checked
		});
	}


	render () {
		const {location} = this.props;
		const {agreed} = this.state;
		const {search} = location || {};
		const params = (search && querystring.parse(search.replace(/^\?/, ''))) || {};


		return (
			<Page.Title title={t('title')}>
				<Page.Content>
					<Form className={cx('signup-form')}>
						<Text.Heading>{t('heading')}</Text.Heading>
						<Text.Paragraph className={cx('message')}>{t('message')}</Text.Paragraph>
						{this.renderInput('firstName', params)}
						{this.renderInput('lastName', params)}
						{this.renderInput('email', params, Input.Email)}
						{this.renderInput('userName', params)}
						{this.renderTerms()}
						<Button disabled={!agreed} fill>
							<Text.Base>{t('createAccount')}</Text.Base>
						</Button>
						<Link to="recover" className={cx('recover-link')}>
							Already have a Trial Site?
						</Link>
					</Form>
				</Page.Content>
			</Page.Title>
		);
	}

	renderInput (name, params = {}, Cmp = Input.Text) {
		const initialValue = params[name];
		const getString = key => t(`${name}.${key}`);

		return (
			<Cmp
				required
				defaultValue={initialValue || ''}
				placeholder={getString('placeholder')}
			/>
		);
	}

	renderTerms () {
		const {agreed} = this.state;
		const label = (<Text.Base className={cx('terms-label')}>{t('termsAndConditions')}</Text.Base>);

		return (
			<Checkbox
				checked={agreed}
				label={label}
				onChange={this.onAgreeChanged}
			/>
		);
	}
}
