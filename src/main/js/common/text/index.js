import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Text} from '@nti/web-commons';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

function Factory (variant, tag) {
	WithClassName.propTypes = {
		className: PropTypes.string 
	};
	function WithClassName ({className, ...otherProps}) {
		return (
			<Text.Base className={cx(className, variant, 'text')} as={tag} {...otherProps} />
		);
	}

	return WithClassName;
}

const TextVariants = {
	Heading: Factory('heading', 'h1'),
	Paragraph: Factory('paragraph', 'p')
};

export default TextVariants;
