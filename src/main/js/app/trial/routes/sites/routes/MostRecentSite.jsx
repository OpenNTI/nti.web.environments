import React from 'react';
import { navigate } from '@reach/router';

import { AuthRouter } from 'internal/common';

export default function MostRecentSite({ location }) {
	const auth = AuthRouter.useAuth();
	const { user } = auth;

	React.useEffect(() => {
		let unmounted = false;
		const getMostRecent = async () => {
			try {
				const mostRecent = await user.getMostRecentSite();

				if (unmounted) {
					return;
				}

				if (!mostRecent) {
					navigate('/', { replace: true });
				} else {
					navigate(`/${mostRecent.id}#nosurvey`, { replace: true });
				}
			} catch (e) {
				if (!unmounted) {
					navigate('/', { replace: true });
				}
			}
		};

		getMostRecent();
		return () => (unmounted = true);
	}, [user]);

	return null;
}
