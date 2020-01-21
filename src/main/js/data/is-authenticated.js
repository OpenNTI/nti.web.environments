export default function isAuthenticated () {
	return new Promise((fulfill) => {
		setTimeout(() => fulfill(false), 5000);
	});
}