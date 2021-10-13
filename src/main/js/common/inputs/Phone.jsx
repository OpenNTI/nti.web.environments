import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import PhoneInput from 'react-phone-number-input/input';

NTIPhoneInput.propTypes = {
	value: PropTypes.string,
	name: PropTypes.string,
	required: PropTypes.bool,
	onChange: PropTypes.func,
};
function NTIPhoneInput(
	{ value: valueProp, name, required, onChange: onChangeProp },
	ref
) {
	const inputRef = useRef();
	const [value, setValue] = useState(null);

	useEffect(() => {
		setValue(valueProp);
	}, [valueProp]);

	useImperativeHandle(ref, () => inputRef.current);

	const onChange = val => {
		setValue(val);

		if (onChangeProp) {
			onChangeProp(val);
		}
	};

	return (
		<PhoneInput
			name={name}
			required={required}
			ref={inputRef}
			value={value}
			onChange={onChange}
			defaultCountry="US"
		/>
	);
}

export default React.forwardRef(NTIPhoneInput);
