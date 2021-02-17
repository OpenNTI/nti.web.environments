import { scoped } from '@nti/lib-locale';

const MaxLength = 63;
const MinLength = 3; // this is just a client side constraint and not in the spec

const t = scoped('nti-web-environments.utils.domain', {
	validCharacters: 'Domain can only contain letters and numbers',
	leadingLetter: 'Domain must start with a letter',
	trailingValid: 'Domain must end with a letter or a number',
	tooLong: 'Domain must be less than 63 characters',
	tooShort: 'Domain must be at least 3 characters',
});

/**
 * Generates a (semi)valid domain from a site name
 * @param {string} siteName the nice name of the site
 * @param {number} reservedSpace the number of characters to be reserved for additional modifications
 * @returns {string} a (semi)valid domain name
 */
export function massageToDomain(siteName, reservedSpace = 0) {
	if (siteName.length < MinLength) {
		return '';
	}

	const domain = siteName
		.trim()
		.toLowerCase()
		.replace(/\s/g, '-')
		.replace(/[^a-z0-9-]/g, '')
		.replace(/^[^a-z]*/, '')
		.replace(/[^a-z0-9]*$/, '');

	return domain.substr(0, MaxLength - reservedSpace);
}

/**
 * Checks if a domain is valid per https://tools.ietf.org/html/rfc1035#section-2.3.1
 * @param {string} domain a domain name to validateDomain
 * @returns {boolean} whether the domain is valid
 */
export function validateDomain(domain) {
	return !(
		(
			domain.match(/[^a-z0-9-]/g) || //Has invalid characters
			domain.match(/^[^a-z]/) || //Doesn't start with a letter
			domain.match(/[^a-z0-9]$/) || //Doesn't end with a letter or number
			domain.length > MaxLength
		) //Has more than 63 characters
	);
}

export function getDomainError(domain) {
	if (domain.match(/[^a-z0-9-]/g)) {
		return new Error(t('validCharacters'));
	}
	if (domain.match(/^[^a-z]/)) {
		return new Error(t('leadingLetter'));
	}
	if (domain.match(/[^a-z0-9]$/)) {
		return new Error(t('trailingValid'));
	}
	if (domain.length > MaxLength) {
		return new Error(t('tooLong'));
	}
	if (domain.length < MinLength) {
		return new Error(t('tooShort'));
	}

	return null;
}
