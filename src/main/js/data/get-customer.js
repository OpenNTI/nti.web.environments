import resolveDomain from './resolve-domain';
import {getServer} from './Client';

let cachedCustomer = null;
const sessionLink = '/onboarding/@@session.ping';

class Customer {
	#data = null;

	constructor (data) {
		this.#data = data || {};
	}

	get Sites () { return this.#data.Sites || []; }
	get organization () { return this.#data.organization; }
	get canCreateSite () { return this.#data.canCreateSite; }
	get canCreateFull () { return false; }

	resolveDomain (subDomain) { return resolveDomain(subDomain, !this.canCreateFull); }

	createSite (data) {
		return new Promise((fulfill) => {
			setTimeout(() => fulfill({
				id: 'new-site'
			}), 5000);
		});
	} 
}

async function loadCustomer () {
	try {
		const session = await getServer().get(sessionLink);

		if (!session.customer) { return null; }

		return new Customer(session.customer);
	} catch (e) { //Instead of throwing up, just return that there is no customer
		return null;
	}
}

getCustomer.setCustomer = (session) => {
	cachedCustomer = session.customer ? new Customer(session.customer) : null;
};
getCustomer.clearCustomer = () => cachedCustomer = null;
export default async function getCustomer () {
	if (!cachedCustomer) { cachedCustomer = loadCustomer(); }

	return cachedCustomer;
}