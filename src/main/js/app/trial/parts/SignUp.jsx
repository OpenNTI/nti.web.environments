import querystring from 'querystring';

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';

import {Page, Text, Form, Button, Link} from '../../../common';
import {setupTrial} from '../API';

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

	onSubmit = async (values) => {
		this.setState({loading: true});

		try {
			const resp = await setupTrial(values);
			
			debugger;
		} finally {
			this.setState({loading: false});
		}

	}

	render () {
		const {location} = this.props;
		const {agreed} = this.state;
		const {search} = location || {};
		const params = (search && querystring.parse(search.replace(/^\?/, ''))) || {};


		return (
			<Page.Title title={t('title')}>
				<Page.Content className={cx('signup-form')}>
					<Text.Heading>{t('heading')}</Text.Heading>
					<Text.Paragraph className={cx('message')}>{t('message')}</Text.Paragraph>
					<Form onSubmit={this.onSubmit} disabled={!agreed} >
						{this.renderInput('firstName', params)}
						{this.renderInput('lastName', params)}
						{this.renderInput('email', params, Form.Input.Email)}
						{this.renderInput('userName', params)}
						{this.renderTerms()}
						<Button type="submit" disabled={!agreed} fill>
							<Text.Base>{t('createAccount')}</Text.Base>
						</Button>
					</Form>
					<Link to="recover" className={cx('recover-link')}>
						Already have a Trial Site?
					</Link>
				</Page.Content>
			</Page.Title>
		);
	}

	renderInput (name, params = {}, Cmp = Form.Input.Text) {
		const initialValue = params[name];
		const getString = key => t(`${name}.${key}`);

		return (
			<Cmp
				required
				name={name}
				defaultValue={initialValue || ''}
				placeholder={getString('placeholder')}
			/>
		);
	}

	renderTerms () {
		const {agreed} = this.state;
		const label = (<Text.Base className={cx('terms-label')}>{t('termsAndConditions')}</Text.Base>);

		return (
			<Form.Input.Checkbox
				required
				name="agreed"
				checked={agreed}
				label={label}
				onChange={this.onAgreeChanged}
			/>
		);
	}
}
