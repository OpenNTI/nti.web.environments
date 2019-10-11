export async function sendVerification (data) {
	return new Promise((fulfill) => {
		setTimeout(() => {
			fulfill();
		}, 1000);
	});
}