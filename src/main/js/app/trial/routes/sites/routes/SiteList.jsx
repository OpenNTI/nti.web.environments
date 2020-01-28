import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Redirect} from '@reach/router';
import {scoped} from '@nti/lib-locale';

import {Page, Text} from '../../../../../common';
import Image from '../assets/sites-image.png';
import NewSiteForm from '../components/NewSiteForm';
import SiteListItem from '../components/SiteListItem';
import SiteListHeader from '../components/SiteListHeader';

import Styles from './SiteList.css';


const cx = classnames.bind(Styles);
const t = scoped('lms-onboarding.trial.routes.sites.routes.SiteList', {
	title: 'Sites',
	empty: {
		canCreate: {
			heading: 'Choose where people will access your website.'
		},
		canNotCreateSite: {
			heading: 'Unable to create a site at this time.'
		}
	},
	notEmpty: {
		canCreate: {
			heading: 'Choose an existing site or create a new one.'
		},
		canNotCreate: {
			heading: 'Choose an existing site.'
		}
	}
});

LMSTrialSiteList.propTypes = {
	location: PropTypes.any,
	customer: PropTypes.object
};
export default function LMSTrialSiteList ({location, customer}) {
	//If they only have one site and they can't create a new one, just forward on to that site
	if (customer && customer.Sites.length === 1 && !customer.canCreateSite) {
		return (
			<Redirect to={`/sites/${customer.Sites[0].id}`} />
		);
	}

	const empty = !customer || !customer.Sites || customer.Sites.length === 0;
	const canCreate = customer && customer.canCreateSite;
	const getString = (key) => t(`${empty ? 'empty' : 'notEmpty'}.${canCreate ? 'canCreate' : 'canNotCreate'}.${key}`);

	return (
		<Page title={t('title')}>
			<Page.Content padded>
				<Text.SmallHeading className={cx('site-list-heading', {empty})}>{getString('heading')}</Text.SmallHeading>
				{empty && (<NewSiteForm customer={customer} />)}
				{!empty && (
					<div className={cx('site-list')}>
						<SiteListHeader customer={customer} />
						<ul>
							{customer.Sites.map((site, key) => (
								<li key={key}>
									<SiteListItem site={site} />
								</li>
							))}
						</ul>
					</div>
				)}
			</Page.Content>
			<Page.Image src={Image} fullscreen />
		</Page>
	);
}