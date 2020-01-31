import Customer from './models/Customer';
import {getServer} from './Client';

let cachedCustomer = null;
const sessionLink = '/onboarding/@@session.ping';


async function loadCustomer () {
	try {
		const session = await getServer().get(sessionLink);

		if (!session.customer) { return null; }

		return new Customer(session.customer);
	} catch (e) { //Instead of throwing up, just return that there is no customer
		return null;
	}
}

getCustomer.setSession = (session) => {
	cachedCustomer = session.customer ? new Customer(session.customer) : null;
};
getCustomer.clearSession = () => cachedCustomer = null;
export default async function getCustomer () {
	if (!cachedCustomer) { cachedCustomer = loadCustomer(); }

	return cachedCustomer;
}