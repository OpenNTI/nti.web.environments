import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { Hooks, Theme } from '@nti/web-commons';
import { Text, Link } from 'internal/common';
import { Client } from 'internal/data';

import Styles from './SiteListItem.css';

const BrandingPath = '/dataserver2/SiteBrand';

const cx = classnames.bind(Styles);

async function loadSiteTheme(site) {
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
		domain: PropTypes.string,
		id: PropTypes.string,
	}),
};
export default function SiteListItem({ site }) {
	const theme = Hooks.useResolver(() => loadSiteTheme(site), [site]);
	const loading = Hooks.useResolver.isPending(theme);

	return (
		<Link
			to={`/sites/${site.id}`}
			className={cx('site-list-item', { loading })}
		>
			<div className={cx('icon')}>
				{!loading && <Theme.Asset property={theme.assets.logo} />}
			</div>
			<div className={cx('meta')}>
				<Text.Base className={cx('name')}>
					{loading ? '' : theme.brandName}
				</Text.Base>
				<Text.Base className={cx('url')}>{site.domain}</Text.Base>
			</div>
		</Link>
	);
}
