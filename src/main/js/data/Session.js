const key = 'nti-onboarding-trial-session';

export function get () {
	try {
		return JSON.parse(sessionStorage.getItem(key));
	} catch (e) {
		//swallow
	}
}

export function set (session) {
	try {
		sessionStorage.setItem(key, JSON.stringify(session));
	} catch (e) {
		//swallow
	}
}