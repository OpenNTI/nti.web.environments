import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';
import {Prompt} from '@nti/web-commons';

import {Text} from '../../../../../common';

import Styles from './SiteListHeader.css';
import NewSiteForm from './NewSiteForm';

const cx = classnames.bind(Styles);
const t = scoped('lms-onboarding.trial.routes.sites.routes.SiteList', {
	sites: {
		other: '%(count)s Sites',
		one: '%(count)s Site'
	},
	create: 'Add a New Site',
	promptTitle: 'Create a New Site'
});

SiteListHeader.propTypes = {
	customer: PropTypes.shape({
		Sites: PropTypes.array,
		canCreateSite: PropTypes.bool
	}).isRequired
};
export default function SiteListHeader ({customer}) {
	const {Sites, canCreateSite} = customer;

	const [prompt, setPrompt] = React.useState(false);

	const openPrompt = () => setPrompt(true);
	const closePrompt = () => setPrompt(false);

	return (
		<div className={cx('site-list-header')}>
			<Text.Base className={cx('count')}>
				{t('sites', {count: Sites.length})}
			</Text.Base>
			{canCreateSite && (
				<div role="button" className={cx('create')} onClick={openPrompt}>
					<i className={cx('icon-add', 'icon')} />
					<Text.Base>{t('create')}</Text.Base>
				</div>
			)}
			{prompt && (
				<Prompt.Dialog onBeforeDismiss={closePrompt}>
					<Prompt.BaseWindow title={t('promptTitle')} doClose={closePrompt} buttons={[]}>
						<NewSiteForm onCancel={closePrompt} modal customer={customer} />
					</Prompt.BaseWindow>
				</Prompt.Dialog>
			)}
		</div>
	);
}