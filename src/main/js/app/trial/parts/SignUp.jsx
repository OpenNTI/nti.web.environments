import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {navigate} from '@reach/router';
import {scoped} from '@nti/lib-locale';
import {Loading, Form, Hooks} from '@nti/web-commons';

import {Page, Text, Inputs, Button, Link} from '../../../common';
import {sendVerification} from '../API';
import {setSession, getSession} from '../Session';

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
	userName: {
		placeholder: 'Username'
	}
});


function renderInput (name, initialValues, Cmp = Inputs.Text) {
	const getString = (key) => t(`${name}.${key}`);

	return (
		<Cmp name={name} required defaultValue={initialValues[name] || ''}  placeholder={getString('placeholder')} />
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
		return getSession() || {};
	}, [location]);

	const onSubmit = async ({json}) => {
		setSaving(true);

		const resp = await sendVerification(json);

		setSession({...json, ...resp});
		navigate('verification');
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
							{renderInput('firstName', initialValues)}
							{renderInput('lastName', initialValues)}
							{renderInput('email', initialValues, Inputs.Email)}
							<Inputs.Checkbox
								required
								name="agreed"
								checked={agreed}
								label={(<Text.Small>{t('termsAndConditions')}</Text.Small>)}
								onChange={(e) => setAgreed(e.target.checked)}
							/>
							<Button as={Form.SubmitButton}>
								<Text.Base>{t('createAccount')}</Text.Base>
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


// export default class LMSTrialSignup extends React.Component {
// 	static propTypes = {
// 		location: PropTypes.shape({
// 			search: PropTypes.string
// 		})
// 	};

// 	state = {agreed: false}

// 	onAgreeChanged = (e) => {
// 		this.setState({
// 			agreed: e.target.checked
// 		});
// 	}

// 	onSubmit = async (values) => {
// 		this.setState({saving: true});

// 		try {
// 			await sendVerification(values);
// 			setSession(values);
// 			navigate('verification');
// 		} finally {
// 			this.setState({saving: false});
// 		}

// 	}

// 	getParams () {
// 		const {location} = this.props;
// 		const {search} = location || {};
// 		const searchParams =  (search && querystring.parse(search.replace(/^\?/, ''))) || {};
// 		const session = getSession() || {};

// 		return {...session, ...searchParams};
// 	}

// 	render () {
// 		const {agreed, saving} = this.state;
// 		const params = this.getParams();

// 		return (
// 			<Page title={t('title')}>
// 				<Page.Content className={cx('signup', {saving})} centerContents>
// 					<Text.Heading>{t('heading')}</Text.Heading>
// 					<Text.Paragraph className={cx('message')}>{t('message')}</Text.Paragraph>
// 					<Form className={cx('signup-form')} onSubmit={this.onSubmit} disabled={!agreed} >
// 						{this.renderInput('firstName', params)}
// 						{this.renderInput('lastName', params)}
// 						{this.renderInput('email', params, Inputs.Email)}
// 						{this.renderInput('userName', params)}
// 						{this.renderTerms()}
// 						<Button type="submit" disabled={!agreed} fill>
// 							<Text.Base>{t('createAccount')}</Text.Base>
// 						</Button>
// 					</Form>
// 					{saving && (
// 						<div className={cx('saving-mask')}>
// 							<Loading.Spinner.Large />
// 						</div>
// 					)}
// 					<Link to="recover" className={cx('recover-link')}>
// 						Already have a Trial Site?
// 					</Link>
// 				</Page.Content>
// 			</Page>
// 		);
// 	}

// 	renderInput (name, params = {}, Cmp = Inputs.Text) {
// 		const initialValue = params[name];
// 		const getString = key => t(`${name}.${key}`);

// 		return (
// 			<Cmp
// 				required
// 				name={name}
// 				defaultValue={initialValue || ''}
// 				placeholder={getString('placeholder')}
// 			/>
// 		);
// 	}

// 	renderTerms () {
// 		const {agreed} = this.state;
// 		const label = (<Text.Base className={cx('terms-label')}>{t('termsAndConditions')}</Text.Base>);

// 		return (
// 			<Inputs.Checkbox
// 				required
// 				name="agreed"
// 				checked={agreed}
// 				label={label}
// 				onChange={this.onAgreeChanged}
// 			/>
// 		);
// 	}
// }
