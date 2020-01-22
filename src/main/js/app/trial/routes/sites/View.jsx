import React from 'react';
import {Router} from '@reach/router';

import SiteList from './routes/SiteList';
import SiteDetails from './routes/SiteDetails';

export default function LMSTrialSites () {
	return (
		<Router>
			<SiteList path="/" />
			<SiteDetails path=":siteId" />
		</Router>
	);
}