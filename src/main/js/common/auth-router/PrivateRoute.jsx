import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Redirect} from '@reach/router';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

PublicRoute.propTypes = {
	className: PropTypes.string,
	authenticated: PropTypes.bool,
	component: PropTypes.any.isRequired,
	routes: PropTypes.shape({
		publicEntry: PropTypes.string
	})
};
export default function PublicRoute ({authenticated, routes, className, component:Cmp, ...otherProps}) {
	if (authenticated === false) {
		return (
			<Redirect to={routes.publicEntry} noThrow />
		);
	}

	return (
		<div className={cx('private-route', className)}>
			<Cmp {...otherProps} />
		</div>
	);
}