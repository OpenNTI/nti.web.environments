import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { Errors } from '@nti/web-commons';

import Styles from './ErrorBar.css';

const cx = classnames.bind(Styles);

ErrorBar.propTypes = {
	className: PropTypes.string,
};
export default function ErrorBar({ className, ...otherProps }) {
	return (
		<Errors.Message
			className={cx(className, 'error-bar')}
			{...otherProps}
		/>
	);
}
