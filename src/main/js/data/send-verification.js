import {getServer} from './Client';

const RecoveryChallengeURL = '/onboarding/customers/@@recovery_challenge';

export default async function sendVerification (data) {
	return getServer().post(RecoveryChallengeURL, data);
}