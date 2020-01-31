import Path from 'path';

import resolveDomain from './resolve-domain';
import {getServer} from './Client';

let cachedCustomer = null;
const sessionLink = '/onboarding/@@session.ping';

const PollInterval = 30000;
const SiteStates = {
	Pending: 'application/vnd.nextthought.app.environments.setupstatepending',
	Success: 'application/vnd.nextthought.app.environments.setupstatesuccess',
	Failure: 'application/vnd.nextthought.app.environments.setupstatefailure'
};

class Site {
	static Cache = new Map();

	static hasCached (id) { return Site.Cache.has(id); }
	static getCached (id) { return Site.Cache.get(id); }

	static createSite (data) {
		const site = new Site(data);

		Site.Cache.set(data.id, site);

		return site;
	}

	#data = null;

	constructor (data) {
		this.#data = data || {};
		this.wasPending = this.isPending;
	}

	get id () { return this.#data.id; }
	get href () { return this.#data.href; }
	get domain () { return (this.#data.dns_names || [])[0]; }

	get status () { return this.#data.status; }
	get setupState () { return this.#data['setup_state'];}
	get state () { return this.setupState?.mimeType; }
	get isPending () { return this.state === SiteStates.Pending; }
	get isSuccess () { return this.state === SiteStates.Success; }
	get isFailure () { return this.state === SiteStates.Failure; }

	onceFinished () {
		this.poll = this.poll || new Promise((fulfill) => {
			let pollCount = 0;
			const ping = async () => {

				try {
					const update = await getServer().get(this.href);

					this.#data = update;

					if (!this.isPending) { return fulfill(this); }

					setTimeout(() => ping(), PollInterval + (PollInterval * pollCount));
					pollCount += 1;
				} catch (e) {
					this.#data = {...this.#data, status: SiteStates.Cancelled};
				}
			};

			if (!this.isPending) {
				fulfill(this);
				return;
			}

			ping();
		});

		return this.poll;
	}

}

class Customer {
	#data = null;

	constructor (data) {
		this.#data = data || {};
	}

	get id  () { return this.#data.email; }

	get Links () { return this.#data.Links || []; }
	get organization () { return this.#data.organization; }
	get canCreateSite () { return this.#data.can_create_new_site; }
	//TODO: drive these off server data
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

		return sites.Items.map(site => Site.createSite(site));
	}

	async getSite (siteId) {
		if (Site.hasCached(siteId)) { return Site.getCached(siteId); }

		const link = this.getLink('sites');
		const siteLink = Path.join(link, siteId);

		const raw = await getServer().get(siteLink);

		return Site.createSite(raw);
	}

	async createSite (data) {
		const link = this.getLink('sites');

		if (!link) { throw new Error('No sites link.'); }

		const raw = await getServer().post(link, {
			owner: data.owner,
			'client_name': data.client_name,
			'dns_names': [data.dns_name]
		});

		return Site.createSite(raw);
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
getCustomer.clearSession = () => cachedCustomer = null;
export default async function getCustomer () {
	if (!cachedCustomer) { cachedCustomer = loadCustomer(); }

	return cachedCustomer;
}