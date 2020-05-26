import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

PageContent.propTypes = {
	className: PropTypes.string,
	containerClassName: PropTypes.string,
	children: PropTypes.any,
	padded: PropTypes.bool,
	fullscreen: PropTypes.bool
};
export default function PageContent ({className, containerClassName, children, fullscreen, padded, ...otherProps}) {
	return (
		<section className={cx('page-content', className, {padded})}>
			<div className={cx('container', containerClassName, { fullscreen })}>
				{children}
			</div>
		</section>
	);
}
