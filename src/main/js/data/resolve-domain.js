import {Domain} from '../utils';

import {getServer} from './Client';

const ValiddateDomainURL = 'onboarding/@@valid_domain';
const SubDomainParam = 'subdomain';
const DNSParamName = 'dns_name';

export default async function resolveDomain (subDomain) {
	const validSubDomain = Domain.massageToDomain(subDomain);

	if (!validSubDomain) {
		const error = Domain.getDomainError(subDomain);
		throw error;
	}

	const resp = await getServer().get(ValiddateDomainURL, {searchParams: {[SubDomainParam]: validSubDomain}});

	if (!resp['is_available']) { throw new Error(`${resp[DNSParamName]} is unavailable.`); }

	return resp[DNSParamName];
}
