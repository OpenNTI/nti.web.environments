import React from 'react';
import PropTypes from 'prop-types';

const TitleContext = React.createContext('Title');
const prefix = 'NextThought: ';
const separator = ' - ';

const setRootTitle = (title) => {
	clearTimeout(setRootTitle.timeout);

	setRootTitle.timeout = setTimeout(() => {
		if (typeof document !== 'undefined') {
			document.title = title ? `${prefix}${title}` : '';
		}
	}, 300);
};

export default class PageTitle extends React.Component {
	static propTypes = {
		title: PropTypes.string,
		children: PropTypes.any
	};

	static contextType = TitleContext;

	componentDidMount () {
		const {title} = this.props;

		this.setTitle(title, this.subTitle);
	}

	componentDidUpdate (prevProps) {
		const {title} = this.props;
		const {title: prevTitle} = prevProps;

		if (title !== prevTitle) {
			this.setTitle(title, this.subTitle);
		}
	}

	setSubTitle = (subTitle) => {
		const {title} = this.props;

		this.subTitle = subTitle;

		this.setTitle(title, subTitle);
	}

	setTitle (title, subTitle) {
		const {setTitle} = this.context;

		let fullTitle;

		if (subTitle && title) {
			fullTitle = `${subTitle}${separator}${title}`;
		} else if (subTitle) {
			fullTitle = subTitle;
		} else {
			fullTitle = title;
		}

		if (setTitle) {
			setTitle(fullTitle || '');
		} else {
			setRootTitle(fullTitle);
		}
	}


	render () {
		const {children} = this.props;

		return (
			<TitleContext.Provider value={{setTitle: this.setSubTitle}}>
				{children}
			</TitleContext.Provider>
		);
	}
}
