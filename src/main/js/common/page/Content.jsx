import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Content.css';

const cx = classnames.bind(Styles);

PageContent.propTypes = {
	className: PropTypes.string,
	children: PropTypes.any,
	centerContents: PropTypes.bool
};
export default function PageContent ({className, children, centerContents, ...otherProps}) {
	return (
		<article className={cx('page-content', className, {'center-contents': centerContents})}>
			{children}
		</article>
	);
}