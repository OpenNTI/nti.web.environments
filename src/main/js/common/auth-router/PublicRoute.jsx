import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { Redirect } from '@reach/router';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

PublicRoute.propTypes = {
	className: PropTypes.string,
	authenticated: PropTypes.bool,
	loading: PropTypes.bool,
	component: PropTypes.any.isRequired,
	routes: PropTypes.shape({
		privateEntry: PropTypes.string,
	}),
};
export default function PublicRoute({
	authenticated,
	loading,
	routes,
	className,
	component: Cmp,
	...otherProps
}) {
	if (authenticated === true && !loading) {
		return <Redirect to={routes.privateEntry} noThrow />;
	}

	return (
		<div className={cx('public-route', className)}>
			<Cmp {...otherProps} />
		</div>
	);
}
