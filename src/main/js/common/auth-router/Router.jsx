import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Router, Location} from '@reach/router';
import {Hooks, Loading} from '@nti/web-commons';

import  Page from '../page';

import Styles from './Styles.css';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const cx = classnames.bind(Styles);

AuthRouter.propTypes = {
	children: PropTypes.any,
	location: PropTypes.object,
	getUser: PropTypes.func.isRequired,
	userProp: PropTypes.string
};
function AuthRouter ({children, location, getUser, userProp = 'user'}) {
	const user = Hooks.useResolver(getUser, [location]);
	const loading = Hooks.useResolver.isPending(user);
	const authenticated = !loading && Boolean(user);

	const routes = React.Children.toArray(children)
		.reduce((acc, child) => {
			if (child.type === PrivateRoute && child.props.entry) {
				acc.privateEntry = child.props.redirectPath || child.props.path;
			} else if (child.type === PublicRoute && child.props.entry) {
				acc.publicEntry = child.props.redirectPath || child.props.path;
			}

			return acc;
		}, {publicEntry: null, privateEntry: null});

	return (
		<>
			<Router className={cx('auth-router', {loading})}>
				{React.Children.map(children, (child) => {
					return React.cloneElement(
						child,
						{
							routes,
							authenticated,
							loading,
							key: child.props.path,
							[userProp]: loading ? null : user
						}
					);
				})}
			</Router>
			<Loading.Placeholder loading={loading} fallback={<Page><Page.Content><Loading.Spinner.Large /></Page.Content></Page>}>
				{null}
			</Loading.Placeholder>
		</>
	);
}

AuthRouterWrapper.PrivateRoute = PrivateRoute;
AuthRouterWrapper.PublicRoute = PublicRoute;
export default function AuthRouterWrapper (props) {
	return (
		<Location>
			{({location}) => (<AuthRouter location={location} {...props} />)}
		</Location>
	);
}