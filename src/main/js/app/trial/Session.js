const key = 'nti-onboarding-trial-session';

export function getSession () {
	try {
		return JSON.parse(sessionStorage.getItem(key));
	} catch (e) {
		//swallow
	}
}

export function setSession (session) {
	try {
		sessionStorage.setItem(key, JSON.stringify(session));
	} catch (e) {
		//swallow
	}
}