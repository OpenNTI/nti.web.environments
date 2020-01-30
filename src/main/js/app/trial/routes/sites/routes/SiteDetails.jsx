/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Redirect} from '@reach/router';
import { Hooks } from '@nti/web-commons';
import confetti from 'canvas-confetti';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { Page, AuthRouter } from '../../../../../common';
import SiteDetailsLoading from '../components/SiteDetailsLoading';
import SiteDetailsCompleted from '../components/SiteDetailsCompleted';

import Styles from './SiteDetails.css';

const cx = classnames.bind(Styles);

SiteDetails.propTypes = {
	siteId: PropTypes.string,
};

export default function SiteDetails ({ siteId }) {
	const [loaded, setLoaded] = useState(false);

	const {loading:customerLoading, user:customer} = AuthRouter.useAuth();
	const site = Hooks.useResolver(() => customer && customer.getSite(siteId), [siteId, customer]);
	const isLoading = customerLoading || Hooks.useResolver.isPending(site);

	useEffect(() => {
		let unmounted = false;
		const ping = async function () {
			try {
				if (unmounted) { return; }

				await Promise.resolve(); // getServer().ping();
				const loadingBar = document.getElementById('loading-bar');
				loadingBar.classList.add('loading-bar-100');
				setTimeout(() => {
					confetti({
						particleCount: 125,
						spread: 100,
						origin: {
							y: 0.65
						},
						colors: ['#3fb34f','#629968','#8AC691','#BFE2DF','#FACB57','#13374D']
					});

					setLoaded(false);
				}, 2000);
			} catch (err) {
				setTimeout(ping, 3000);
			}
		};

		setTimeout(() => {
			ping();
		}, 11000);

		return () => unmounted = true;
	}, []);

	if (!isLoading && site.isNotPending) {
		const redirect = site.hasCompletedAdminInvite ? site.domain : site.adminInvite;

		return (<Redirect to={redirect} />);
	}

	setTimeout(() => {
		const loadingBar = document.getElementById('loading-bar');
		loadingBar?.classList.add('loading-bar-90');
	}, 200);

	return (
		<Page>
			<Page.Content className={cx('section')} fullscreen>
				<TransitionGroup component={null}>
					{loaded && (
						<CSSTransition key="details-loading" classNames="site-details" timeout={300}>
							<SiteDetailsLoading />
						</CSSTransition>
					)}
					{!loaded && (
						<CSSTransition key="details-completed" classNames="site-details" timeout={300}>
							<SiteDetailsCompleted />
						</CSSTransition>
					)}
				</TransitionGroup>
			</Page.Content>
		</Page>
	);
}
