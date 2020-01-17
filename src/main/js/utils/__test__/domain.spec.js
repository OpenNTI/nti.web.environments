/* eslint-env jest */
import * as Domain from '../domain.js';

describe('massageToDomain', () => {
	const mappings = {
		startsWithSpace: [' I start with a space', '-i-start-with-a-space'],
		endsWithSpace: ['I end with a space ', 'i-end-with-a-space-'],
		allSpaces: ['     ', '-----'],
		startsWithNumber: ['1337yo', '1337yo'],
		endsWithNumber: ['glhf7', 'glhf7'],
		allNumbers: ['123456789', '123456789'],
		startsWithInvalidCharacters: ['朱莉是最好的 is my domain', '-is-my-domain'],
		endsWithInvalidCharacters: ['My domain is 朱莉仍然是最好的', 'my-domain-is-'],
		containsInvalidCharacters: ['Domains are @%#!ing #*!@%', 'domains-are-ing-'],
		tooLong: [
			'This is an incredibly long site name that I have no idea why anyone in their right mind would use',
			'this-is-an-incredibly-long-site-name-that-i-have-no-idea-why-an'
		]
	};
	for(let [key, value] of Object.entries(mappings)) {
		test(key, () => {
			expect(Domain.massageToDomain(value[0])).toEqual(value[1]);
		});
	}
	test('respects reserved space', () => {
		expect(Domain.massageToDomain('domain', 62)).toHaveLength(1);
	});
});

describe('validateDomain', () => {
	test('allows starting letter', () => {
		expect(Domain.validateDomain('aaa')).toBe(true);
	});

	test('disallows starting numeral', () => {
		expect(Domain.validateDomain('123domain')).toBe(false);
	});

	test('disallows starting dash', () => {
		expect(Domain.validateDomain('-domain')).toBe(false);
	});

	test('allows ending letter', () => {
		expect(Domain.validateDomain('domain')).toBe(true);
	});

	test('allows ending numeral', () => {
		expect(Domain.validateDomain('domain1')).toBe(true);
	});

	test('disallows ending dash', () => {
		expect(Domain.validateDomain('domain-')).toBe(true);
	});

	test('disallows invalid character', () => {
		expect(Domain.validateDomain('valid!invalid!valid')).toBe(false);
	});

	test('allows 63 characters', () => {
		expect(Domain.validateDomain('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')).toBe(true);
	});

	test('disallows 64 characters', () => {
		expect(Domain.validateDomain('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')).toBe(false);
	});
});
