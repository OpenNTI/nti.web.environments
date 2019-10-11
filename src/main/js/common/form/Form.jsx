import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Form.css';
import FormContext from './Context';
import Inputs from './inputs';
import getErrorMessage from './get-error-message';

const cx = classnames.bind(Styles);

const InputValueGetters = {
	'text': f => f.value,
	'email': f => f.value,
	'checkbox': f => f.checked
};


export default class Form extends React.Component {
	static Input = Inputs;

	static propTypes = {
		className: PropTypes.string,
		onSubmit: PropTypes.func,
		disabled: PropTypes.bool
	};

	state = {}

	form = React.createRef()

	getErrors () {
		const form = this.form.current;

		if (!form) { return null; }

		const invalid = Array.from(form.querySelectorAll(':invalid'));

		if (!invalid || !invalid.length) { return null; }

		return invalid.reduce((acc, field) => {
			const message = getErrorMessage(field);

			acc[field.name] = message;

			return acc;
		}, {});
	}

	getValues () {
		const form = this.form.current;

		if (!form) { return null; }

		const fields = Array.from(form.elements);

		return fields.reduce((acc, field) => {
			if (field.name) {
				acc[field.name] = InputValueGetters[field.type](field);
			}

			return acc;
		}, {});
	}


	clearError = (name) => {
		const {errors} = this.state;

		if (errors && errors[name]) {
			this.setState({
				errors: {
					...errors,
					[name]: void 0
				}
			});
		}
	}

	onSubmit = (e) => {
		e.preventDefault();
		e.stopPropagation();

		const {disabled, onSubmit} = this.props;

		if (disabled) { return; }

		const errors = this.getErrors();

		if (errors) {
			this.setState({errors});
		} else if (onSubmit) {
			onSubmit(this.getValues());
		}
	}


	render () {
		const {className, disabled, ...otherProps} = this.props;
		const {errors} = this.state;

		delete otherProps.onSubmit;

		return (
			<FormContext.Provider value={{errors, clearError: this.clearError}}>
				<form
					className={cx('form', className, {disabled})}
					ref={this.form}
					onSubmit={this.onSubmit}
					noValidate
					{...otherProps}
				/>
			</FormContext.Provider>
		);
	}
}
