import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

PageContent.propTypes = {
	className: PropTypes.string,
	children: PropTypes.any
};
export default function PageContent ({className, children, ...otherProps}) {
	return (
		<section className={cx('page-content', className)}>
			<div className={cx('container')}>
				{children}
			</div>
		</section>
	);
}