import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Redirect} from '@reach/router';
import {scoped} from '@nti/lib-locale';

import {Page, Text, Link} from '../../../common';
import {getSession} from '../Session';

import Styles from './Verification.css';

const cx = classnames.bind(Styles);
const t = scoped('lms-onboarding.trail.parts.Verification', {
	title: 'Verification',
	heading: 'Check your Email',
	sent: 'We\'ve sent a 6-digit information code to:',
	change: 'Not You? Click here',
	expires: 'It will expire shortly, so enter it soon.'
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
					<Text.Heading className={cx('verify-heading')}>{t('heading')}</Text.Heading>
					<div className={cx('verify-sent')}>
						<Text.Paragraph>{t('sent')}</Text.Paragraph>
						<Text.Paragraph><strong>{session.email}</strong></Text.Paragraph>
						<Link to="/">
							<Text.Base>{t('change')}</Text.Base>
						</Link>
					</div>
					<Text.Paragraph>{t('expires')}</Text.Paragraph>
				</Page.Content>
			</Page.Title>
		);
	}
}
