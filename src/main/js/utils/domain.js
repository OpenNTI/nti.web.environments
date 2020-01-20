/**
 * Generates a (semi)valid domain from a site name
 * @param {string} siteName the nice name of the site
 * @param {number} reservedSpace the number of characters to be reserved for additional modifications
 * @return {string} a (semi)valid domain name
 */
export function massageToDomain (siteName, reservedSpace = 0) {
	let domain = siteName.toLowerCase();
	domain = domain.replace(/ /g, '-');
	domain = domain.replace(/[^a-z0-9-]/g, '');

	domain = domain.substr(0, 63 - reservedSpace);

	return domain;
}

/**
 * Checks if a domain is valid per https://tools.ietf.org/html/rfc1035#section-2.3.1
 * @param {string} domain a domain name to validateDomain
 * @return {boolean} whether the domain is valid
 */
export function validateDomain (domain) {
	return !(
		domain.match(/[^a-z0-9-]/g) ||	//Has invalid characters
		domain.match(/^[^a-z]/) ||		//Doesn't start with a letter
		domain.match(/[^a-z0-9]$/) ||	//Doesn't end with a letter or number
		domain.length > 63				//Has more than 63 characters
	);
}
