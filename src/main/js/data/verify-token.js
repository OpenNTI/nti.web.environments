import {getServer} from './Client';
import getCustomer from './get-customer';

const EmailVerifyURL = '/onboarding/customers/@@email_challenge_verify';

/* eslint-disable */
function insertCapterraTracking () {
	var capterra_vkey = 'f9d05440982b82076e16f3066b581f15',
		capterra_vid = '2108870',
		capterra_prefix = (('https:' == document.location.protocol)
		? 'https://ct.capterra.com' : 'http://ct.capterra.com');
	var ct = document.createElement('script');
	ct.type = 'text/javascript';
	ct.async = true;
	ct.src = capterra_prefix + '/capterra_tracker.js?vid='
	+ capterra_vid + '&vkey=' + capterra_vkey;
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(ct, s);
}
/* eslint-enable */

export default async function verifyToken (data) {
	const session = await getServer().post(EmailVerifyURL, {
		email: data.email,
		code: `${data.code_prefix}${data.code}`
	});

	insertCapterraTracking();

	//Currently the session coming back as the response
	//isn't fully decorating the customer...
	//clearing the session will trigger us to load the
	//session the next time we try and get the customer
	// getCustomer.setSession(session);
	getCustomer.clearSession();
	return session;
}
