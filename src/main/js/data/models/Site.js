import {getServer} from '../Client';

import getLink from './get-link';

const SiteStates = {
	Pending: 'application/vnd.nextthought.app.environments.setupstatepending',
	Success: 'application/vnd.nextthought.app.environments.setupstatesuccess',
	Failure: 'application/vnd.nextthought.app.environments.setupstatefailure'
};

const Intervals = {
	OneMinute: 60000,
	TwoMinutes: 120000
};

function getIntervalGenerator () {
	const start = new Date();

	return () => {
		const now = new Date();
		const diff = now - start;

		if (diff <= Intervals.OneMinute) {
			return 15000;
		}

		if (diff <= Intervals.TwoMinutes) {
			return 5000;
		}

		return diff - Intervals.TwoMinutes;
	};
}


export default class Site {
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
		//Since the poll is mutating the site instance.
		//We are tracking the initial pending value to determine
		//if the site was already finished when we loaded it, or
		//finished after polling.
		this.wasPending = this.isPending;
	}

	getLink (rel) { return getLink(this.#data.Links, rel); }

	get id () { return this.#data.id; }
	get href () { return this.#data.href; }
	get domain () { return (this.#data.dns_names || [])[0]; }
	get continueLink () { return this.getLink('setup.continue'); }
	get pollLink () { return this.getLink('setup.check-pending'); }

	get status () { return this.#data.status; }
	get setupState () { return this.#data['setup_state'];}
	get state () { return this.setupState?.MimeType; }
	get isPending () { return (!this.state && this.status === 'PENDING') || this.state === SiteStates.Pending; }
	get isSuccess () { return this.state === SiteStates.Success; }
	get isFailure () { return this.state === SiteStates.Failure; }

	onceFinished () {
		this.poll = this.poll || new Promise((fulfill) => {
			const getInterval = getIntervalGenerator();

			const ping = async () => {
				try {
					const update = await getServer().get(this.pollLink);

					this.#data = update;

					if (!this.isPending) { return fulfill(this); }

					setTimeout(() => ping(), getInterval());
				} catch (e) {
					this.#data = {
						...this.#data,
						'setup_state': {
							MimeType: SiteStates.Failure
						}
					};

					fulfill(this);
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
