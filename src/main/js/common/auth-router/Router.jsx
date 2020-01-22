import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Router} from '@reach/router';
import {Hooks, Loading} from '@nti/web-commons';

import  Page from '../page';

import Styles from './Styles.css';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const cx = classnames.bind(Styles);

AuthRouter.PrivateRoute = PrivateRoute;
AuthRouter.PublicRoute = PublicRoute;
AuthRouter.propTypes = {
	children: PropTypes.any,
	isAuthenticated: PropTypes.func.isRequired
};
export default function AuthRouter ({children, isAuthenticated}) {
	const authenticated = Hooks.useResolver(isAuthenticated, [isAuthenticated]);
	const loading = Hooks.useResolver.isPending(authenticated);

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
							key: child.props.path,
							authenticated: loading ? null : authenticated
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