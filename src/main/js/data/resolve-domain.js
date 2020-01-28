import {Rand, Domain} from '../utils';

import {getServer} from './Client';

const DNSLookupURL = 'onboarding/@@check_dns_name';
const DNSParamName = 'dns_name';

//To prevent a run away loop checking
//for valid domains, just limit it to 10
//tries for now.
const MaxTries = 10;
const TrialHashSize = 4;

const TLD = 'io';
const Host = 'nextthought';

function resolveTrialURL (subDomain) {
	const hash = Rand.randomNumberOfLength(TrialHashSize);
	const maybeValidDomain = Domain.massageToDomain(subDomain, hash.length);

	if (!maybeValidDomain) {
		const error = Domain.getDomainError(subDomain);

		throw error;
	}

	const hashedSubDomain = `${maybeValidDomain}-${hash}`;

	return `${hashedSubDomain}.${Host}.${TLD}`;
}

function resolveURL (subDomain) {
	const maybeValidDomain = Domain.massageToDomain(subDomain);

	if (!maybeValidDomain) {
		const error = Domain.getDomainError(subDomain);

		throw error;
	}

	return `${maybeValidDomain}.${Host}.${TLD}`;
}

async function checkURL (url) {
	const resp = await getServer().get(DNSLookupURL, {searchParams: {[DNSParamName]: url}});

	return resp.is_available ? resp[DNSParamName] : null;
}

export default function resolveDomain (subDomain, trial) {
	const tries = new Set();
	const resolver = trial ? resolveTrialURL : resolveURL;

	const attempt = async () => {
		let url = resolver(subDomain);

		if (tries.size > MaxTries) { throw new Error('Unavailable'); }

		while (tries.has(url)) {
			url = resolver(subDomain);
		}

		tries.add(url);

		try {
			const availableURL = await checkURL(url);

			if (!availableURL) { throw new Error('URL is not available');}

			return availableURL;
		} catch (e) {
			attempt();
		}
	};


	return attempt();
}