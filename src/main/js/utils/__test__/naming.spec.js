/* eslint-env jest */
import * as Naming from '../naming.js';

describe('generateDomain', () => {
	const mappings = {
		startsWithSpace: [' I start with a space', 'i-start-with-a-space'],
		endsWithSpace: ['I end with a space  ', 'i-end-with-a-space'],
		allSpaces: ['     ', ''],
		startsWithNumber: ['1337yo', 'yo'],
		endsWithNumber: ['glhf7', 'glhf7'],
		allNumbers: ['123456789', ''],
		startsWithInvalidCharacters: ['朱莉是最好的 is my domain', 'is-my-domain'],
		endsWithInvalidCharacters: ['My domain is 朱莉仍然是最好的', 'my-domain-is'],
		containsInvalidCharacters: ['Domains are @%#!ing #*!@%', 'domains-are-ing'],
		tooLong: [
			'This is an incredibly long site name that I have no idea why anyone in their right mind would use',
			'this-is-an-incredibly-long-site-name-that-i-have-no-idea-why-an'
		]
	};
	for(let [key, value] of Object.entries(mappings)) {
		test(key, () => {
			expect(Naming.generateDomain(value[0])).toEqual(value[1]);
		});
	}
	test('respects reserved space', () => {
		expect(Naming.generateDomain('domain', 62)).toHaveLength(1);
	})
});
