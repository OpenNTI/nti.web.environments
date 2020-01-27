import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Hooks, Theme} from '@nti/web-commons';

import {Text} from '../../../../../common';
import {Client} from '../../../../../data';

import Styles from './SiteListItem.css';

const BrandingPath = '/dataserver2/SiteBrand';

const cx = classnames.bind(Styles);

async function loadSiteTheme (site) {
	try {
		const branding = await Client.getServer(site.url).get(BrandingPath);
		const overrides = Theme.siteBrandToTheme(branding);
		const theme = Theme.buildTheme();

		theme.setOverrides(overrides);

		return theme;
	} catch (e) {
		return Theme.buildTheme();
	}
}


SiteListItem.propTypes = {
	site: PropTypes.shape({
		url: PropTypes.string
	})
};
export default function SiteListItem ({site}) {
	const theme = Hooks.useResolver(() => loadSiteTheme(site), [site]);
	const loading = Hooks.useResolver.isPending(theme);

	return (
		<div className={cx('site-list-item', {loading})}>
			<div className={cx('icon')}>
				{!loading && (<Theme.Asset property={theme.assets.logo} />)}
			</div>
			<div className={cx('meta')}>
				<Text.Base className={cx('name')}>{loading ? '' : theme.brandName}</Text.Base>
				<Text.Base className={cx('url')}>{site.url}</Text.Base>
			</div>
		</div>
	);
}