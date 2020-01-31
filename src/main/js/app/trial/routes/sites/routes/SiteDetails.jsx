/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Redirect} from '@reach/router';
import { Hooks } from '@nti/web-commons';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { Page, AuthRouter } from '../../../../../common';
import SiteDetailsLoading from '../components/SiteDetailsLoading';
import SiteDetailsCompleted from '../components/SiteDetailsCompleted';

import Styles from './SiteDetails.css';

const cx = classnames.bind(Styles);
const {isPending, isErrored, isResolved} = Hooks.useResolver;

SiteDetails.propTypes = {
	siteId: PropTypes.string,
};

export default function SiteDetails ({ siteId }) {
	const [loadFinished, setLoadFinished] = React.useState(false);

	const {loading:customerLoading, user:customer} = AuthRouter.useAuth();
	const site = Hooks.useResolver(() => !customerLoading && customer && customer.getSite(siteId), [siteId, customer]);
	const isLoading = customerLoading || isPending(site);

	const finished = Hooks.useResolver(async () => {
		if (isLoading) { return false; }

		await site.onceFinished();

		return true;
	}, [site]);

	const loaded = isResolved(finished) && finished;
	const timedout = isErrored(finished);

	if (loaded && !site.wasPending) {
		return (<Redirect to={site.domain} />);
	}

	const onFinished = () => setLoadFinished(true);

	return (
		<Page>
			<Page.Content className={cx('section')} fullscreen>
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
