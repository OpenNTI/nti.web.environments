/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { Hooks } from '@nti/web-commons';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { Page, AuthRouter } from '../../../../../common';
import SiteDetailsLoading from '../components/SiteDetailsLoading';
import SiteDetailsCompleted from '../components/SiteDetailsCompleted';

import Styles from './SiteDetails.css';

const cx = classnames.bind(Styles);
const {isResolved} = Hooks.useResolver;

SiteDetails.propTypes = {
	siteId: PropTypes.string,
};

export default function SiteDetails ({ siteId }) {
	const [loadFinished, setLoadFinished] = React.useState(false);

	const {loading:customerLoading, user:customer} = AuthRouter.useAuth();

	const site = Hooks.useResolver(async () => {
		if (customerLoading || !customer) { return false; }

		const resolvedSite = await customer.getSite(siteId);

		await resolvedSite.onceFinished();

		return resolvedSite;
	}, [siteId, customer]);

	const loaded = isResolved(site) && site;
	const siteWasSetup = loaded && !site.wasPending;

	React.useEffect(() => {
		if (siteWasSetup) {
			global?.location?.replace(site.continueLink);
		}
	}, [siteWasSetup]);

	if (siteWasSetup) {
		return null;
	}

	const onFinished = () => setLoadFinished(true);

	return (
		<Page>
			<Page.Content className={cx('section', {loaded})} fullscreen>
				<TransitionGroup component={null}>
					{!loadFinished && (
						<CSSTransition key="details-loading" classNames="site-details" timeout={300}>
							<SiteDetailsLoading progress={loaded ? 100 : 90} onFinished={onFinished} />
						</CSSTransition>
					)}
					{loadFinished && (
						<CSSTransition key="details-completed" classNames="site-details" timeout={300}>
							<SiteDetailsCompleted site={site} />
						</CSSTransition>
					)}
				</TransitionGroup>
			</Page.Content>
		</Page>
	);
}
