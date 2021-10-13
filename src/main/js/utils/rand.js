const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * Generates a random number of a specified length, avoiding offensive numbers
 *
 * @param {number} length the length of the number generated
 * @returns {string} a random number
 */
export function randomNumberOfLength(length) {
	let availableDigits = digits.slice();
	let number = '';
	for (let i = 0; i < length; i++) {
		let randDigitIndex = Math.floor(Math.random() * availableDigits.length);
		number += availableDigits[randDigitIndex];
		availableDigits.splice(randDigitIndex, 1);
		if (availableDigits.length <= 0) {
			availableDigits = digits.slice();
		}
	}

	return number;
}
