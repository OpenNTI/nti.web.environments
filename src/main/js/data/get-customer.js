import resolveDomain from './resolve-domain';

class Customer {
	#data = null;

	constructor (data) {
		this.#data = data;
	}

	get Sites () { return this.#data.Sites; }
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

export default function getCustomer () {
	return new Promise((fulfill) => {
		setTimeout(() => {
			fulfill(new Customer({
				Sites: [
					{id: 'existing-site', url: 'https://alpha.nextthought.com'},
					{id: 'other-site', url: 'https://alpha.nextthought.com'}
				],
				canCreateSite: true
			}));
		}, 5000);
	});
}