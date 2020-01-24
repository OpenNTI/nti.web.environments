import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Redirect} from '@reach/router';
import {scoped} from '@nti/lib-locale';
import {Hooks, Loading} from '@nti/web-commons';

import {Page, Text} from '../../../../../common';
import {getCustomer} from '../../../../../data';
import Image from '../assets/sites-image.png';
import NewSiteForm from '../components/NewSiteForm';
import SiteListItem from '../components/SiteListItem';

import Styles from './SiteList.css';

const {isPending, isResolved} = Hooks.useResolver;

const cx = classnames.bind(Styles);
const t = scoped('lms-onboarding.trial.parts.SignUp', {
	title: 'Sites',
	empty: {
		canCreate: {
			heading: 'Choose were people will access your website.'
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
	},
	sites: {
		other: '%(count)s Sites',
		one: '%(count)s Site'
	}
});

LMSTrialSites.propTypes = {
	location: PropTypes.any
};
export default function LMSTrialSites ({location}) {
	const customer = Hooks.useResolver(getCustomer, [location]);

	//If we can't find the customer start over
	if (Hooks.useResolver.isErrored(customer)) {
		return (
			<Redirect to="/" />
		);
	}

	//If they only have one site and they can't create a new one, just forward on to that site
	if (isResolved(customer) && customer.Sites.length === 1 && !customer.canCreateSite) {
		return (
			<Redirect to={`/sites/${customer.Sites[0].id}`} />
		);
	}

	const empty = isPending(customer) || !customer.Sites || customer.Sites.length === 0;
	const canCreate = isResolved(customer) && customer.canCreateSite;
	const getString = (key) => t(`${empty ? 'empty' : 'notEmpty'}.${canCreate ? 'canCreate' : 'canNotCreate'}.${key}`);

	return (
		<Page title={t('title')}>
			<Page.Content padded>
				<Loading.Placeholder loading={isPending(customer)} fallback={(<Loading.Spinner.Large />)}>
					<Text.SmallHeading className={cx('site-list-heading')}>{getString('heading')}</Text.SmallHeading>
					{empty && (<NewSiteForm customer={customer} />)}
					{!empty && (
						<div className={cx('site-list')}>
							<div className={cx('header')}>
								<Text.Small className={cx('count')}>{t('sites', {count: customer.Sites.length})}</Text.Small>
							</div>
							<ul>
								{customer.Sites.map((site, key) => (
									<li key={key}>
										<SiteListItem site={site} />
									</li>
								))}
							</ul>
						</div>
					)}
				</Loading.Placeholder>
			</Page.Content>
			<Page.Image src={Image} fullscreen />
		</Page>
	);
}