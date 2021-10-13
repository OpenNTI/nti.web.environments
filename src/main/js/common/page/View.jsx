import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Styles.css';
import Content from './Content';
import Image from './Image';
import Title from './Title';

const cx = classnames.bind(Styles);

Page.Content = Content;
Page.Image = Image;
Page.Title = Title;
Page.propTypes = {
	title: PropTypes.string,
	children: PropTypes.any,
};
export default function Page({ title, children, ...otherProps }) {
	return (
		<article className={cx('page')}>
			{title ? <Title title={title}>{children}</Title> : children}
		</article>
	);
}
