export async function sendVerification (data) {
	return new Promise((fulfill) => {
		setTimeout(() => {
			fulfill({
				code: '123456'
			});
		}, 5000);
	});
}

export async function verifyToken (token) {
	return new Promise((fulfill, reject) => {
		setTimeout(() => {
			fulfill({});
		}, 5000);
	});
}