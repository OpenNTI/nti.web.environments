export default function getCustomer () {
	return new Promise((fulfill) => {
		setTimeout(() => {
			fulfill({
				Sites: [],
				canCreateSite: true
			});
		}, 5000);
	});
}