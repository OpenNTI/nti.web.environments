import React from 'react';
import PropTypes from 'prop-types';

import Content from './Content';
import Title from './Title';

Page.Content = Content;
Page.Title = Title;
Page.propTypes = {
	title: PropTypes.string,
	children: PropTypes.any
};
export default function Page ({title, children, ...otherProps}) {
	return (
		<div>
			{
				title ?
					(<Title title={title}>{children}</Title>) :
					children
			}
		</div>
	);
}
