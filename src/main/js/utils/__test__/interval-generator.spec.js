/* eslint-env jest */
import {Date as DateUtils} from '@nti/lib-commons';

import getIntervalGenerator from '../interval-generator';

const {MockDate} = DateUtils;


const dates = {
	start: 'February 14, 2020 12:00:00',
	plus15: 'February 14, 2020 12:00:15',
	plus30: 'February 14, 2020 12:00:30',
	plus45: 'February 14, 2020 12:00:45',
	plus60: 'February 14, 2020 12:01:00',
	plus75: 'February 14, 2020 12:01:15',
	plus90: 'February 14, 2020 12:01:30',
	plus105: 'February 14, 2020 12:01:45',
	plus120: 'February 14, 2020 12:02:00',
	plus135: 'February 14, 2020 12:02:15',
	plus150: 'February 14, 2020 12:02:30',
	plus165: 'February 14, 2020 12:02:45',
	plus180: 'February 14, 2020 12:03:00',
	plus195: 'February 14, 2020 12:03:15'
};

const quick = [
	dates.plus15,
	dates.plus30,
	dates.plus45,
	dates.plus60,
	dates.plus75,
	dates.plus90,
	dates.plus105,
	dates.plus120,
	dates.plus135,
	dates.plus150,
	dates.plus165,
	dates.plus180
];

const long = [
	dates.plus195
];

describe('intervalGenerator', () => {
	beforeEach(() => {
		MockDate.install();
	});

	afterEach(() => {
		MockDate.uninstall();
	});

	test('for less than a three minutes the interval is 5 seconds, after three minutes interval is 30 seconds', () => {
		MockDate.setDestination(dates.start).hit88MPH();

		const nextInterval = getIntervalGenerator();

		for (let date of quick) {
			expect(nextInterval()).toEqual(5000);
			MockDate.setDestination(date).hit88MPH();
		}

		for (let date of long) {
			MockDate.setDestination(date).illBeBack();
			expect(nextInterval()).toEqual(30000);
		}

	});
});
