import React from 'react';
import {Router} from '@reach/router';

import SiteList from './routes/SiteList';
import SiteDetails from './routes/SiteDetails';

export default function LMSTrialSites (props) {
	return (
		<Router>
			<SiteList {...props} path="/" />
			<SiteDetails {...props} path=":siteId" />
		</Router>
	);
}