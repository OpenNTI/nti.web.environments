import Path from 'path';

import {getServer} from '../Client';
import resolveDomain from '../resolve-domain';

import getLink from './get-link';
import Site from './Site';
import {SiteId, FailedSite} from './test_data';

const PendingSite = {'Class': 'PersistentSite', 'CreatedTime': 1581030837.119819, 'Creator': 'chris.utz@nextthought.com', 'Last Modified': 1581030837.1544752, 'Links': [{'Class': 'Link', 'href': '/onboarding/sites/Se53085151a1f4792818c62425fc41b10/@@query-setup-state', 'rel': 'setup.check-pending'}], 'MimeType': 'application/vnd.nextthought.app.environments.site', 'client_name': 'asdfasdfasd', 'dns_names': ['asdfasdfasd.nextthought.io'], 'environment': null, 'href': '/onboarding/sites/Se53085151a1f4792818c62425fc41b10/@@query-setup-state?max_wait=10', 'id': 'Se53085151a1f4792818c62425fc41b10', 'license': {'Class': 'TrialLicense', 'CreatedTime': 1581030837.1446857, 'Last Modified': 1581030837.1446857, 'MimeType': 'application/vnd.nextthought.app.environments.triallicense', 'end_date': '2020-05-06T23:13:57Z', 'start_date': '2020-02-06T23:13:57Z'}, 'owner': {'Class': 'PersistentCustomer', 'CreatedTime': 1581026299.9643183, 'Last Modified': 1581026317.0248823, 'Links': [{'Class': 'Link', 'href': '/onboarding/customers/chris.utz@nextthought.com/sites', 'rel': 'sites'}], 'MimeType': 'application/vnd.nextthought.app.environments.customer', 'can_create_new_site': true, 'email': 'chris.utz@nextthought.com', 'hubspot_contact': {'Class': 'HubspotContact', 'CreatedTime': 1581026317.7935326, 'Last Modified': 1581026317.7935326, 'MimeType': 'application/vnd.nextthought.app.environments.hubspotcontact', 'contact_vid': '12580601'}, 'last_verified': '2020-02-06T21:58:37Z', 'name': 'Chris Utz', 'organization': 'NextThought'}, 'parent_site': null, 'setup_state': {'Class': 'SetupStatePending', 'CreatedTime': 1581030838.2684557, 'Last Modified': 1581030838.2684557, 'MimeType': 'application/vnd.nextthought.app.environments.setupstatepending'}, 'status': 'PENDING'};

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
		if (Site.hasCached(SiteId)) { return Site.getCached(SiteId); }

		return Site.createSite(FailedSite);
		// if (Site.hasCached(siteId)) { return Site.getCached(siteId); }

		// const link = this.getLink('sites');
		// const siteLink = Path.join(link, siteId);

		// const raw = await getServer().get(siteLink);

		// return Site.createSite(raw);
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