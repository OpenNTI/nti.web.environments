import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Text} from '@nti/web-commons';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

function Factory (variant, tag) {
	WithClassName.propTypes = {
		className: PropTypes.string,
		centered: PropTypes.bool
	};
	function WithClassName ({className, centered, ...otherProps}) {
		return (
			<Text.Base className={cx(className, variant, 'text', {centered})} as={tag} {...otherProps} />
		);
	}

	return WithClassName;
}

const TextVariants = {
	Base: Factory(),
	Heading: Factory('heading', 'h1'),
	Paragraph: Factory('paragraph', 'p'),
	Small: Factory('small')
};

export default TextVariants;
