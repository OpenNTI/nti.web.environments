import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Button.css';

const cx = classnames.bind(Styles);

Button.propTypes = {
	as: PropTypes.any,
	className: PropTypes.string,
	disabled: PropTypes.bool,
	fill: PropTypes.bool,
};
export default function Button({
	as: tag,
	className,
	disabled,
	fill,
	...otherProps
}) {
	const Cmp = tag || 'button';

	return (
		<Cmp
			{...otherProps}
			className={cx(className, 'button', { disabled, fill })}
			aria-disabled={disabled}
		/>
	);
}
