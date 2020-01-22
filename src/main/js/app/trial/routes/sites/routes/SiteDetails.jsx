/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Redirect} from '@reach/router';
import { getServer } from '@nti/web-client';
import {Loading, Hooks} from '@nti/web-commons';

import { Page, Text } from '../../../../../common';
import { lookUpSite } from '../../../../../data';
import LoadingSVG from '../assets/LoadingSvg';

import Styles from './SiteDetails.css';

const cx = classnames.bind(Styles);

SiteDetails.propTypes = {
	siteId: PropTypes.string,
};

export default function SiteDetails ({ siteId }) {
	const site = Hooks.useResolver(() => lookUpSite(siteId), [siteId]);

	useEffect(() => {
		let unmounted = false;
		const ping = async function () {
			try {
				if (unmounted) { return; }

				await getServer().ping();
				const loadingBar = document.getElementById('loading-bar');

				loadingBar.classList.add('loading-bar-100');
			} catch (err) {
				setTimeout(ping, 3000);
			}
		};

		setTimeout(() => {
			ping();
		}, 2000);

		return () => unmounted = true;
	}, []);

	if (Hooks.useResolver.isResolved(site) && site.isNotPending) {
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
				<Loading.Placeholder
					loading={Hooks.useResolver.isPending(site)}
					fallback={(<Loading.Spinner.Large />)}
				>
					<LoadingSVG />
					<Text.Heading className={cx('heading')}>
						Hold Tight!
					</Text.Heading>
					<Text.Paragraph className={cx('paragraph')}>
						We are getting everything just right. <br></br> This may
						take a moment...
					</Text.Paragraph>
					<img className={cx('logo')} src="/resources/images/nt-logo.svg" />
				</Loading.Placeholder>
			</Page.Content>
		</Page>
	);
}
