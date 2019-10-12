import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Redirect} from '@reach/router';
import {scoped} from '@nti/lib-locale';

import {Page, Text, Link, Form, Button} from '../../../common';
import {getSession} from '../Session';

import Styles from './Verification.css';

const cx = classnames.bind(Styles);
const t = scoped('lms-onboarding.trail.parts.Verification', {
	title: 'Verification',
	heading: 'Check your Email',
	sent: 'We\'ve sent a 6-digit information code to:',
	change: 'Not You? Click here',
	expires: 'It will expire shortly, so enter it soon.',
	keep: 'Keep this window open while checking for your code.',
	spam: 'Remember to try your spam folder!',
	check: 'Check Code'
});

export default class LMSTrialVerification extends React.Component {
	static propTypes = {
		location: PropTypes.shape({
			hash: PropTypes.string
		})
	}

	state = {codeParts: ['', '']}

	firstInput = React.createRef()
	secondInput = React.createRef()

	focusSecondInput () {
		if (this.secondInput && this.secondInput.current) {
			this.secondInput.current.focus();
		}
	}


	onSubmit = (value) => {
		debugger;
	}


	onFirstInputChange = (value) => {
		const {codeParts} = this.state;

		//If we get 6 characters assume they are pasting
		if (value.length === 6) {
			this.setState({
				codeParts: [value.substring(0, 3), value.substring(3, 6)]
			});
			this.focusSecondInput();
		} else if (value.length === 3) {
			this.setState({
				codeParts: [value.substring(0, 3), codeParts[1]]
			});
			this.focusSecondInput();
		} else {
			this.setState({
				codeParts: [value.substring(0, 3), codeParts[1]]
			});
		}
	}

	onSecondInputChange = (value) => {
		const {codeParts} = this.state;

		this.setState({
			codeParts: [codeParts[0], value.substring(0, 3)]
		});
	}

	render () {
		const session = getSession();
		const {codeParts} = this.state;

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
					<Form className={cx('token-form')} onSubmit={this.onSubmit}>
						<div className={cx('token-input-container')}>
							<Form.Input.Text
								name="first-part"
								className={cx('token-input')}
								ref={this.firstInput}
								onChange={this.onFirstInputChange}
								value={codeParts[0] || ''}
							/>
							<span className={cx('spacer')}>&mdash;</span>
							<Form.Input.Text
								name="second-part"
								className={cx('token-input')}
								ref={this.secondInput}
								onChange={this.onSecondInputChange}
								value={codeParts[1] || ''}
							/>
						</div>
						<Button className={cx('submit-token')} type="submit">
							<Text.Base>{t('check')}</Text.Base>
						</Button>
					</Form>
					<Text.Paragraph>{t('keep')}</Text.Paragraph>
					<Text.Paragraph>{t('spam')}</Text.Paragraph>
				</Page.Content>
			</Page.Title>
		);
	}
}
