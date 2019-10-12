export async function sendVerification (data) {
	return new Promise((fulfill) => {
		setTimeout(() => {
			fulfill();
		}, 1000);
	});
}

export async function verifyToken (token) {
	throw new Error('Test Error');
}