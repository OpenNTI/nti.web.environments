/* eslint-env jest */
import * as Rand from '../rand.js';

describe('randomNumberOfLength', () => {
	test('to have the correct length', () => {
		const length = 6;
		expect(Rand.randomNumberOfLength(length)).toHaveLength(length);
	});
});
