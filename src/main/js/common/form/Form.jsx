import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Form.css';

const cx = classnames.bind(Styles);

Form.propTypes = {
	className: PropTypes.string
};
export default function Form ({className, ...otherProps}) {
	return (
		<form className={cx('form', className)} {...otherProps} />
	);
}