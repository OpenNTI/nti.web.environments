import React from 'react';
import PropTypes from 'prop-types';
import PhoneInput from 'react-phone-number-input/input';

NTIPhoneInput.propTypes = {
	value: PropTypes.string,
	name: PropTypes.string,
	onChange: PropTypes.func,
};
function NTIPhoneInput ({value:valueProp, name, onChange:onChangeProp}, ref) {
	const inputRef = React.useRef();
	const [value, setValue] = React.useState(null);

	React.useEffect(() => {
		setValue(valueProp);
	}, [valueProp]);

	React.useImperativeHandle(ref, () => inputRef.current);

	const onChange = (val) => {
		setValue(val);

		if (onChangeProp) {
			onChangeProp(val);
		} 
	};

	return (
		<PhoneInput
			name={name}
			ref={inputRef}
			value={value}
			onChange={onChange}
			defaultCountry="US"
		/>
	);
}

export default React.forwardRef(NTIPhoneInput);