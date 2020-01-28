import resolveDomain from './resolve-domain';
import {getServer} from './Client';

let cachedCustomer = null;
const sessionLink = '/onboarding/@@session.ping';

class Customer {
	#data = null;

	constructor (data) {
		this.#data = data || {};
	}

	get Links () { return this.#data.Links || []; }
	get organization () { return this.#data.organization; }
	//TODO: drive these off server data
	get canCreateSite () { return true; }
	get canCreateFull () { return false; }

	getLink (rel) {
		for (let link of this.Links) {
			if (link.rel === rel) {
				return link.href;
			}
		}
	}

	resolveDomain (subDomain) { return resolveDomain(subDomain, !this.canCreateFull); }

	async getSites () {
		const link = this.getLink('sites');

		if (!link) { return []; }

		const sites = await getServer().get(link);

		return sites.Items;
	}

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

getCustomer.setSession = (session) => {
	cachedCustomer = session.customer ? new Customer(session.customer) : null;
};
getCustomer.clearCustomer = () => cachedCustomer = null;
export default async function getCustomer () {
	if (!cachedCustomer) { cachedCustomer = loadCustomer(); }

	return cachedCustomer;
}