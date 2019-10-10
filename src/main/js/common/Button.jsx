import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Button.css';

const cx = classnames.bind(Styles);

Button.propTypes = {
	className: PropTypes.string,
	disabled: PropTypes.bool,
	fill: PropTypes.bool
};
export default function Button ({className, disabled, fill, ...otherProps}) {
	return (
		<button className={cx(className, 'button', {disabled, fill})} aria-disabled={disabled} {...otherProps} />
	);
}
