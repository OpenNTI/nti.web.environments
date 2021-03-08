import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { Form } from '@nti/web-commons';

import Domain from './Domain';
import Phone from './Phone';
import Styles from './Styles.css';

const cx = classnames.bind(Styles);

function WrapperFactory(Cmp, inputProps, wrapperClassName) {
	OnboardingFormInput.propTypes = {
		className: PropTypes.string,
		inputRef: PropTypes.any,
		underline: PropTypes.bool,
	};
	function OnboardingFormInput({
		className,
		inputRef,
		underline,
		...otherProps
	}) {
		return (
			<Cmp
				className={cx(className, wrapperClassName, 'form-input')}
				ref={inputRef}
				{...inputProps}
				{...otherProps}
			/>
		);
	}

	const RefWrapper = (props, ref) => (
		<OnboardingFormInput {...props} inputRef={ref} />
	);
	return React.forwardRef(RefWrapper);
}

export default {
	Text: WrapperFactory(Form.Input.Text),
	Code: WrapperFactory(Form.Input.Text, {}, 'code'),
	Email: WrapperFactory(Form.Input.Email),
	Hidden: WrapperFactory(Form.Input.Hidden),
	Checkbox: WrapperFactory(Form.Input.Checkbox),
	Domain: WrapperFactory(Form.Input.wrap(Domain)),
	Phone: WrapperFactory(Form.Input.wrap(Phone)),
};
