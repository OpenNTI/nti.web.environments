export default function verifyToken (token) {
	return new Promise((fulfill, reject) => {
		setTimeout(() => {
			fulfill({});
		}, 5000);
	});
}