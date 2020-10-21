import Customer from './models/Customer';
import {getServer} from './Client';

let cachedCustomer = null;
const sessionLink = '/onboarding/@@session.ping';

function maybeTrackHubspot (customer) {
	if (customer.hubspot_contact) {
		const _hsq = window._hsq = window._hsq || [];
		_hsq.push(['identify',{
			email: customer.email
		}]);
		// calling identify isn't enough to get hs to associate
		// data, we actually have to ram an event through
		// for the identify to do anything.
		_hsq.push(['trackEvent', {
			id: 'ASCI Customer Identified'
		}]);
	}
}

async function loadCustomer () {
	try {
		const session = await getServer().get(sessionLink);

		if (!session.customer) { return null; }

		maybeTrackHubspot(session.customer);

		return new Customer(session.customer);
	} catch (e) { //Instead of throwing up, just return that there is no customer
		return null;
	}
}

getCustomer.setSession = (session) => {
	cachedCustomer = session.customer ? new Customer(session.customer) : null;
};
getCustomer.clearSession = () => cachedCustomer = null;
getCustomer.hasCached = () => !cachedCustomer;
export default async function getCustomer () {
	if (!cachedCustomer) { cachedCustomer = loadCustomer(); }

	return cachedCustomer;
}
