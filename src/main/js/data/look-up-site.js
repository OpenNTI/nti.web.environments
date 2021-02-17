/**
 * Testing Configs
 */

const base = {
	domain: 'https://www.alpha.nextthought.com/',
	adminInvite: 'https://www.alpha.nextthought.com/login',
};

const adminHasNotCompleted = {
	hasCompletedAdminInvite: false,
	isNotPending: false,
	...base,
};

/**
 * End
 */

export default function lookUpSite(token) {
	return new Promise((fulfill, reject) => {
		setTimeout(() => {
			fulfill({
				...adminHasNotCompleted,
			});
		}, 5000);
	});
}
