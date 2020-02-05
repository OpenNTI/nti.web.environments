/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import {Redirect} from '@reach/router';
import { scoped } from '@nti/lib-locale';
import { Hooks, Loading } from '@nti/web-commons';

import { Page, AuthRouter, Text, Link } from '../../../../../common';
import SiteDetailsLoading from '../components/SiteDetailsLoading';
import SiteDetailsCompleted from '../components/SiteDetailsCompleted';

import Styles from './SiteDetails.css';

const {isResolved, isPending, isErrored} = Hooks.useResolver;

const cx = classnames.bind(Styles);
const t = scoped('lms-onboarding.trial.sites.routes.SiteDetails', {
	loading: 'Looking up your site...',
	notfound: {
		heading: 'Site Not Found'
	}
});

SiteDetails.propTypes = {
	siteId: PropTypes.string,
	location: PropTypes.shape({
		hash: PropTypes.string
	})
};

export default function SiteDetails ({siteId, location}) {
	const [loadAnimationFinished, setLoadAnimationFinished] = React.useState(false);
	const onAnimationFinished = () => setLoadAnimationFinished(true);

	const {loading:customerLoading, user:customer} = AuthRouter.useAuth();

	const siteResolver = Hooks.useResolver(async () => {
		if (customerLoading || !customer) { return null; }

		const resolvedSite = await customer.getSite(siteId);

		return resolvedSite;
	}, [siteId, customerLoading]);

	const siteLoading = isPending(siteResolver) || customerLoading || !siteResolver;
	const siteError = isErrored(siteResolver) ? siteResolver : null;
	const site = !siteLoading && !siteError ? siteResolver : null;

	const finished = Hooks.useResolver(async () => {
		if (!site) { return false; }

		await site.onceFinished();
	
		return true;
	}, [site]);


	const loaded = isResolved(finished) && finished;
	const autoRedirect = loaded && site && !site.wasPending && site.isSuccess;

	React.useEffect(() => {
		if (autoRedirect && site.continueLink) {
			global?.location?.replace(site.continueLink);
		}
	}, [autoRedirect]);

	if (autoRedirect) {
		return null;
	}

	const showLoading = siteLoading || (!loadAnimationFinished && site.wasPending);

	const currentState = location.hash;
	const state = showLoading ? '#loading' : (site.isSuccess ? '#success' : '#failure');

	return (
		<Page>
			<Page.Content className={cx('section', {loaded})} fullscreen>
				{siteError && (
					<div className={cx('missing-site')}>
						<Text.Heading>
							{t('notfound.heading')}
						</Text.Heading>
						<Text.Paragraph>
							<Link to="..">Go back to Sites</Link>
						</Text.Paragraph>
					</div>
				)}
				{!siteError && (
					<Loading.Placeholder loading={siteLoading} fallback={(<Text.Paragraph centered>{t('loading')}</Text.Paragraph>)}>
						<TransitionGroup component={null}>
							{showLoading && (
								<CSSTransition key="details-loading" classNames="site-details" timeout={300}>
									<SiteDetailsLoading progress={loaded ? 100 : 90} onFinished={onAnimationFinished} />
								</CSSTransition>
							)}
							{!showLoading && (
								<CSSTransition key="details-completed" classNames="site-details" timeout={300}>
									<SiteDetailsCompleted site={site} />
								</CSSTransition>
							)}
						</TransitionGroup>
					</Loading.Placeholder>
				)}
				{state !== currentState ? (<Redirect to={`/sites/${siteId}/${state}`} noThrow />) : null}
			</Page.Content>
		</Page>
	);
}
