import {getServer} from './Client';

const EmailChallengeURL = '/onboarding/customers/@@email_challenge';

export default async function sendVerification (data) {
	return getServer().post(EmailChallengeURL, {
		name: `${data.firstName || ''} ${data.lastName || ''}`,
		...data
	});
}