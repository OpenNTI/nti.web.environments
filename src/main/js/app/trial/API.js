export async function sendVerification (data) {
	return new Promise((fulfill) => {
		setTimeout(() => {
			fulfill();
		}, 1000);
	});
}

export async function verifyToken (token) {
	return new Promise((fulfill) => {
		setTimeout(() => {
			fulfill();
		}, 1000);
	});
}