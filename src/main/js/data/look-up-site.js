
/**
 * Testing Configs
 */

const base = {
	domain: 'https://www.alpha.nextthought.com/',
	adminIntive: 'https://www.alpha.nextthought.com/login',
};

const adminHasNotCompleted = {
	hasCompletedAdminInvite: false,
	isNotPending: false,
	...base
};

const adminHasCompleted = {
	hasCompletedAdminInvite: true,
	isNotPending: true,
	...base
};

/**
 * End
 */

export default function lookUpSite (token) {
	return new Promise((fulfill, reject) => {
		setTimeout(() => {
			fulfill({
				...adminHasNotCompleted
			});
		}, 5000);
	});
}
