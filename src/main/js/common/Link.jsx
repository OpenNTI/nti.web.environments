import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { Link } from '@reach/router';

import Styles from './Link.css';

const cx = classnames.bind(Styles);

Link.propTypes = {
	className: PropTypes.string,
};
export default function LinkWrapper({ className, ...otherProps }) {
	return <Link className={cx('link', className)} {...otherProps} />;
}
