import querystring from 'querystring';

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Link} from '@reach/router';
import {scoped} from '@nti/lib-locale';
import {Input} from '@nti/web-commons';

import {Page, Text, Form} from '../../../common';

import Styles from './Setup.css';

const cx = classnames.bind(Styles);
const t = scoped('lms-onboarding.trial.parts.Setup', {
	title: 'Setup',
	heading: 'Welcome to NextThought',
	message: 'Complete your account details to get started.',
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

export default class LMSTrialCreation extends React.Component {
	static propTypes = {
		location: PropTypes.shape({
			search: PropTypes.string
		})
	};


	render () {
		const {location} = this.props;
		const {search} = location || {};
		const params = (search && querystring.parse(search.replace(/^\?/, ''))) || {};


		return (
			<Page.Title title={t('title')}>
				<Page.Content>
					<Form className={cx('setup-form')}>
						<Text.Heading>{t('heading')}</Text.Heading>
						<Text.Paragraph className={cx('message')}>{t('message')}</Text.Paragraph>
						{this.renderInput('firstName', params)}
						{this.renderInput('lastName', params)}
						{this.renderInput('email', params, Input.Email)}
						{this.renderInput('userName', params)}
						<Link to="recover">
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
				disable={initialValue && (params.allowEdit && params.allowEdit !== 'true')}
				defaultValue={initialValue || ''}
				placeholder={getString('placeholder')}
			/>
		);
	}
}
