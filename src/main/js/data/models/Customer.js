import Path from 'path';

import {getServer} from '../Client';
import resolveDomain from '../resolve-domain';

import getLink from './get-link';
import Site from './Site';

export default class Customer {
	#data = null;

	constructor (data) {
		this.#data = data || {};
	}

	get id  () { return this.#data.email; }

	get Links () { return this.#data.Links || []; }
	get organization () { return this.#data.organization; }
	get canCreateSite () { return this.#data.can_create_new_site; }

	getLink (rel) { return getLink(this.#data.Links, rel); }

	resolveDomain (subDomain) { return resolveDomain(subDomain); }

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