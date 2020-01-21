export default function isAuthenticated () {
	return new Promise((fulfill) => {
		setTimeout(() => fulfill(true), 5000);
	});
}