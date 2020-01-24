import React from 'react';
import PropTypes from 'prop-types';
import {Hooks} from '@nti/web-commons';

import {Client} from '../../../../../data';

const BrandingPath = '/dataserver2/SiteBrand';

async function loadSiteBranding (site) {
	try {
		const branding = await Client.getServer(site.url).get(BrandingPath);

		return branding;
	} catch (e) {
		throw new Error('Unable to load site branding');
	}
}


SiteListItem.propTypes = {
	site: PropTypes.shape({
		url: PropTypes.string
	})
};
export default function SiteListItem ({site}) {
	const branding = Hooks.useResolver(() => loadSiteBranding(site), [site]);

	return (
		<div>
			Site
		</div>
	);
}