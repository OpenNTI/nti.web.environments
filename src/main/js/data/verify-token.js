import {getServer} from './Client';

const EmailVerifyURL = '/onboarding/customers/@@email_challenge_verify';

export default async function verifyToken (data) {
	const session = getServer().post(EmailVerifyURL, {
		email: data.email,
		code: `${data.code_prefix}${data.code}`
	});

	debugger;
}