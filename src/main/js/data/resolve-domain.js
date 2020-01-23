import {Rand, Domain} from '../utils';

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

function checkURL (url) {
	return new Promise((fulfill) => {
		setTimeout(() => fulfill(), 3000);
	});
}

export default function resolveDomain (subDomain, hash) {
	const tries = new Set();
	const resolver = hash ? resolveTrialURL : resolveURL;

	const attempt = async () => {
		let url = resolver(subDomain);
		let tryCount = 1;

		while (tries.has(url)) {
			url = resolver(subDomain);
			tryCount += 1;

			if (tryCount > MaxTries) { throw new Error('Unavailable'); }
		}

		tries.add(url);

		try {
			await checkURL(url);

			return url;
		} catch (e) {
			attempt();
		}
	};


	return attempt();
}