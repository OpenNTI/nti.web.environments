import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

PageImage.propTypes = {
	src: PropTypes.string,
	className: PropTypes.string,
	fullscreen: PropTypes.bool
};
export default function PageImage ({src, className, fullscreen}) {
	return (
		<section className={cx('page-image', {fullscreen}, className)}>
			<img src={src} alt="" />
		</section>
	);
}
