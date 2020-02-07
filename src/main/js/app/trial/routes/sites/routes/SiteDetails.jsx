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

const {isPending, isErrored} = Hooks.useResolver;

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

	//If we have a site, it wasn't pending when we loaded it, and its not
	//pending now we need to auto redirect.
	const autoRedirect = site && !site.wasPending && !site.isPending && site.continueLink;

	React.useEffect(() => {
		if (autoRedirect) {
			global?.location?.replace(site.continueLink);
		}
	}, [autoRedirect]);

	if (autoRedirect) {
		return null;
	}

	//Show loading if we don't have a site yet, the site is pending, or the site is
	//no longer pending but the animation has not finished.
	//
	//NOTE: if the site is still loading we don't show the site progress bar, but we don't have a site
	//yet so we need to short circuit
	const showLoading = siteLoading || site.isPending || (site.wasPending && !loadAnimationFinished);

	const currentState = location.hash;
	const state = showLoading ? '#loading' : (site.isSuccess ? '#success' : '#failure');

	return (
		<Page>
			<Page.Content className={cx('section')} fullscreen>
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
									<SiteDetailsLoading site={site} onFinished={onAnimationFinished} />
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
