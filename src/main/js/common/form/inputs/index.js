import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Input, Checkbox} from '@nti/web-commons';

import FormContext from '../Context';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

function WrapperFactory (Cmp, wrapperClassName, clearOn = 'onKeyPress') {
	FormInput.propTypes = {
		name: PropTypes.string.isRequired,
		className: PropTypes.string,
		inputRef: PropTypes.any
	};
	function FormInput ({className, name, inputRef, ...otherProps}) {
		return (
			<FormContext.Consumer>
				{(form) => {
					const {errors = {}, clearError} = form || {};
					const clearProps = {};

					if (clearOn) {
						clearProps[clearOn] = (e) => {
							if (otherProps[clearOn]) { otherProps[clearOn](e); }

							clearError(name);
						};
					}

					return (
						<Input.Label className={cx(className, wrapperClassName, 'form-input')} error={errors[name]}>
							<Cmp
								name={name}
								ref={inputRef}
								{...clearProps}
								{...otherProps}
							/>
						</Input.Label>
					);
				}}
			</FormContext.Consumer>
		);
	}

	const RefWrapper = (props, ref) => (<FormInput {...props} inputRef={ref} />);
	return React.forwardRef(RefWrapper);
}

const InputTypes = {
	Text: WrapperFactory(Input.Text),
	Email: WrapperFactory(Input.Email),
	Checkbox: WrapperFactory(Checkbox, cx('checkbox-input'), 'onChange')
};

export default InputTypes;

