import {getServer} from './Client';
import getCustomer from './get-customer';

const EmailVerifyURL = '/onboarding/customers/@@email_challenge_verify';

export default async function verifyToken (data) {
	const session = await getServer().post(EmailVerifyURL, {
		email: data.email,
		code: `${data.code_prefix}${data.code}`
	});


	//Currently the session coming back as the response
	//isn't fully decorating the customer...
	//clearing the session will trigger us to load the
	//session the next time we try and get the customer
	// getCustomer.setSession(session);
	getCustomer.clearSession();
	return session;
}