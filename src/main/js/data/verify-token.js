import {getServer} from './Client';
import getCustomer from './get-customer';

const EmailVerifyURL = '/onboarding/customers/@@email_challenge_verify';

export default async function verifyToken (data) {
	const session = await getServer().post(EmailVerifyURL, {
		email: data.email,
		code: `${data.code_prefix}${data.code}`
	});


	getCustomer.setSession(session);
}