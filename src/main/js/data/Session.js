const key = 'nti-onboarding-trial-session';

export function get(_key = key) {
	try {
		return JSON.parse(sessionStorage.getItem(_key));
	} catch (e) {
		//swallow
	}
}

export function set(session, _key = key) {
	try {
		sessionStorage.setItem(_key, JSON.stringify(session));
	} catch (e) {
		//swallow
	}
}
