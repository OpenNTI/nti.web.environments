import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Redirect, Link} from '@reach/router';
import {scoped} from '@nti/lib-locale';

import {Page, Text} from '../../../common';
import {getSession} from '../Session';

import Styles from './Verification.css';

const cx = classnames.bind(Styles);
const t = scoped('lms-onboarding.trail.parts.Verification', {
	title: 'Verification',
	heading: 'Check your Email'
});

export default class LMSTrialVerification extends React.Component {
	static propTypes = {
		location: PropTypes.shape({
			hash: PropTypes.string
		})
	}


	render () {
		const session = getSession();

		if (!session) {
			return (
				<Redirect to="/" />
			);
		}

		return (
			<Page.Title title={t('title')}>
				<Page.Content centerContents className={cx('verification')}>
					<Text.Heading>{t('heading')}</Text.Heading>
					<Text.Base>{session.email}</Text.Base>
					<Link to="/">
						<Text.Base>Change Email</Text.Base>
					</Link>
				</Page.Content>
			</Page.Title>
		);
	}
}
