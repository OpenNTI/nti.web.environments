import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {Loading, Form} from '@nti/web-commons';

import {Text, Inputs, Button} from '../../../../../common';

import Styles from './NewSiteForm.css';
import DomainPreview from './DomainPreview';

const cx = classnames.bind(Styles);
const t = scoped('lms-onboarding.trial.sites.components.NewSiteForm', {
	siteName: {
		label: 'Site Name',
		placeholder: 'Site Name'
	},
	domain: {
		label: 'Domain Name',
		placeholder: 'Domain Name'
	},
	note: {
		label: 'Note: ',
		message: 'This can be changed later.'
	},
	continue: 'Continue'
});



NewSiteForm.propTypes = {
	customer: PropTypes.shape({
		orginization: PropTypes.string
	}).isRequired
};
export default function NewSiteForm ({customer}) {
	const defaultValue = customer.orginization || '';

	const [synced, setSynced] = React.useState(true);
	const [domain, setDomain] = React.useState(defaultValue);
	const [valid, setValid] = React.useState(false);


	const onChange = (form) => {
		if (synced) {
			setDomain(form.json['site-name']);
		}
	};

	const onSubmit = () => {
		debugger;
	};

	return (
		<Form className={cx('new-site-form')} onSubmit={onSubmit} onChange={onChange} disabled={!valid} >
			<Inputs.Text
				underline
				name="site-name"
				label={t('siteName.label')}
				placeholder={t('siteName.placeholder')}
				defaultValue={defaultValue}
			/>
			<Inputs.Text
				underline
				name="domain-name"
				label={t('domain.label')}
				placeholder={t('domain.placeholder')}
				value={domain}
				onChange={value => (setSynced(false), setDomain(value))}
			/>
			<DomainPreview domain={domain} customer={customer} onValid={() => setValid(true)} onInvalid={() => setValid(false)} />

			<Text.Paragraph callout>
				<i className="icon-hint" />
				<strong>{t('note.label')}</strong>
				<span>{t('note.message')}</span>
			</Text.Paragraph>

			<Button as={Form.SubmitButton}>
				<Text.Base>{t('continue')}</Text.Base>
			</Button>
		</Form>
	);
}