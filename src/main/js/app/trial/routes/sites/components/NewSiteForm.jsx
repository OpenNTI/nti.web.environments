import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {navigate} from '@reach/router';
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
		orginization: PropTypes.string,
		createSite: PropTypes.func
	}).isRequired
};
export default function NewSiteForm ({customer}) {
	const defaultValue = customer.orginization || '';

	const [domain, setDomain] = React.useState({synced: true, value: defaultValue});
	const [valid, setValid] = React.useState(false);

	const [saving, setSaving] = React.useState(false);

	const onChange = (form) => {
		if (domain.synced) {
			setDomain({synced: true, value: form.json['site-name']});
		}
	};

	const onSubmit = async ({json}) => {
		setSaving(true);

		try {
			const site = await customer.createSite(json);

			navigate(`/sites/${site.id}`);
		} finally {
			setSaving(false);
		}
	};

	return (
		<>
			<Form className={cx('new-site-form', {saving})} onSubmit={onSubmit} onChange={onChange} disabled={!valid} >
				<Inputs.Text
					underline
					name="site-name"
					label={t('siteName.label')}
					placeholder={t('siteName.placeholder')}
					defaultValue={defaultValue}
				/>
				<Inputs.Text
					underline
					name="sub-domain"
					label={t('domain.label')}
					placeholder={t('domain.placeholder')}
					value={domain.value}
					onChange={(value, e) => (e.stopPropagation(), e.preventDefault(), setDomain({synced: false, value}))}
				/>
				<DomainPreview domain={domain.value} customer={customer} onValid={() => setValid(true)} onInvalid={() => setValid(false)} />

				<Text.Paragraph callout>
					<i className="icon-hint" />
					<strong>{t('note.label')}</strong>
					<span>{t('note.message')}</span>
				</Text.Paragraph>

				<Button as={Form.SubmitButton}>
					<Text.Base>{t('continue')}</Text.Base>
				</Button>
			</Form>
			{saving && (<Loading.Spinner.Large  />)}
		</>
	);
}