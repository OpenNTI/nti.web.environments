export default function sendVerification (data) {
	return new Promise((fulfill) => {
		setTimeout(() => {
			fulfill({
				code: '123456'
			});
		}, 5000);
	});
}