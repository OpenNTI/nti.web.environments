import { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { scoped } from '@nti/lib-locale';
import { Prompt } from '@nti/web-commons';
import { Text } from 'internal/common';

import Styles from './SiteListHeader.css';
import NewSiteForm from './NewSiteForm';

const cx = classnames.bind(Styles);
const t = scoped('lms-onboarding.trial.routes.sites.routes.SiteList', {
	sites: {
		other: '%(count)s Sites',
		one: '%(count)s Site',
	},
	create: 'Add a New Site',
	promptTitle: 'Create a New Site',
});

SiteListHeader.propTypes = {
	customer: PropTypes.shape({
		canCreateSite: PropTypes.bool,
	}).isRequired,
	sites: PropTypes.array,
};
export default function SiteListHeader({ customer, sites }) {
	const { canCreateSite } = customer;

	const [prompt, setPrompt] = useState(false);

	const openPrompt = () => setPrompt(true);
	const closePrompt = () => setPrompt(false);

	return (
		<div className={cx('site-list-header')}>
			<Text.Base className={cx('count')}>
				{t('sites', { count: sites.length })}
			</Text.Base>
			{canCreateSite && (
				<div
					role="button"
					className={cx('create')}
					onClick={openPrompt}
				>
					<i className={cx('icon-add', 'icon')} />
					<Text.Base>{t('create')}</Text.Base>
				</div>
			)}
			{prompt && (
				<Prompt.Dialog onBeforeDismiss={closePrompt}>
					<Prompt.BaseWindow
						title={t('promptTitle')}
						doClose={closePrompt}
						buttons={[]}
					>
						<NewSiteForm
							onCancel={closePrompt}
							modal
							customer={customer}
						/>
					</Prompt.BaseWindow>
				</Prompt.Dialog>
			)}
		</div>
	);
}
