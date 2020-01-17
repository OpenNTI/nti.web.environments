/**
 * Generates a valid domain from a site name
 * Follows rules laid out in https://tools.ietf.org/html/rfc1035#section-2.3.1
 * @param {string} siteName the nice name of the site
 * @param {number} reservedSpace the number of characters to be reserved for additional modifications
 * @return {string} a valid domain name
 */
export function generateDomain (siteName, reservedSpace = 0) {
	let domain = siteName.toLowerCase();
	domain = domain.replace(/ /g, '-');
	domain = domain.replace(/[^a-z0-9-]/g, '');

	domain = domain.substr(0, 63 - reservedSpace);

	domain = domain.replace(/^[^a-z]+/, '');
	domain = domain.replace(/[^a-z0-9]+$/, '');

	return domain;
}
