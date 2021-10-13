import { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { navigate } from '@reach/router';

import { scoped } from '@nti/lib-locale';
import { Loading, Form, DialogButtons } from '@nti/web-commons';
import { Text, Inputs, Button } from 'internal/common';

import Styles from './NewSiteForm.css';
import DomainPreview from './DomainPreview';

const cx = classnames.bind(Styles);
const t = scoped('lms-onboarding.trial.sites.components.NewSiteForm', {
	siteName: {
		label: 'Site Name',
		placeholder: 'Site Name',
	},
	domain: {
		label: 'Domain Name',
		placeholder: 'Domain Name',
	},
	note: {
		label: 'Note: ',
		message: 'This can be changed later.',
	},
	continue: 'Continue',
	create: 'Create',
	cancel: 'Cancel',
});

NewSiteForm.propTypes = {
	customer: PropTypes.shape({
		organization: PropTypes.string,
		createSite: PropTypes.func,
		id: PropTypes.any,
	}).isRequired,
	onCancel: PropTypes.func,
	modal: PropTypes.bool,
};
export default function NewSiteForm({ customer, modal, onCancel }) {
	const defaultValue = customer.organization || '';

	const [domain, setDomain] = useState({
		synced: true,
		value: defaultValue,
	});
	const [valid, setValid] = useState(false);

	const [saving, setSaving] = useState(false);

	const onChange = form => {
		if (domain.synced) {
			setDomain({ synced: true, value: form.json['client_name'] });
		}
	};

	const onSubmit = async ({ json }) => {
		setSaving(true);

		try {
			const site = await customer.createSite(json);

			navigate(`/sites/${site.id}/#start`);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className={cx('new-site', { modal })}>
			<Form
				className={cx('new-site-form', { saving })}
				onSubmit={onSubmit}
				onChange={onChange}
				disabled={!valid}
			>
				<div className={cx('form-content')}>
					<Inputs.Text
						type="hidden"
						name="owner"
						value={customer.id}
					/>
					<Inputs.Text
						underlined
						fill
						name="client_name"
						label={t('siteName.label')}
						defaultValue={defaultValue}
					/>
					<Inputs.Text
						underlined
						fill
						noError
						name="domain"
						label={t('domain.label')}
						value={domain.value}
						onChange={(value, e) => (
							e.stopPropagation(),
							e.preventDefault(),
							setDomain({ synced: false, value })
						)}
					/>
					<DomainPreview
						domain={domain.value}
						customer={customer}
						onValid={() => setValid(true)}
						onInvalid={() => setValid(false)}
					/>

					<Text.Paragraph callout>
						<i className="icon-hint" />
						<strong>{t('note.label')}</strong>
						<span>{t('note.message')}</span>
					</Text.Paragraph>
				</div>
				{modal && (
					<DialogButtons
						className={cx('new-site-buttons')}
						buttons={[
							{ label: t('cancel'), onClick: onCancel },
							{ label: t('create'), tag: Form.SubmitButton },
						]}
					/>
				)}
				{!modal && (
					<Button as={Form.SubmitButton}>
						<Text.Base>{t('continue')}</Text.Base>
					</Button>
				)}
			</Form>
			{saving && (
				<div className={cx('spinner')}>
					<Loading.Spinner.Large />
				</div>
			)}
		</div>
	);
}
