import {getServer} from './Client';

const EmailChallengeURL = '/onboarding/customers/@@email_challenge';

export default async function sendVerification (data, url = EmailChallengeURL) {
	return getServer().post(url, data);
}
