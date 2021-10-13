import { Router } from '@reach/router';

import MostRecent from './routes/MostRecentSite';
import SiteList from './routes/SiteList';
import SiteDetails from './routes/SiteDetails';

export default function LMSTrialSites(props) {
	return (
		<Router>
			<SiteList path="/" />
			<MostRecent path="most-recent" />
			<SiteDetails path=":siteId" />
		</Router>
	);
}
