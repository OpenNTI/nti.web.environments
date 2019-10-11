import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Errors} from '@nti/web-commons';

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
		disabled: PropTypes.bool,
		children: PropTypes.any
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
		const {errors, globalError} = this.state;

		if (errors && errors[name]) {
			this.setState({
				globalError: null,
				errors: {
					...errors,
					[name]: void 0
				}
			});
		} else if (globalError) {
			this.setState({
				globalError: null
			});
		}
	}

	onSubmit = (e) => {
		e.preventDefault();
		e.stopPropagation();

		const {disabled} = this.props;

		if (disabled) { return; }

		const errors = this.getErrors();

		if (errors) {
			this.setState({errors});
		} else {
			this.doSubmit();
		}
	}

	async doSubmit () {
		const {onSubmit} = this.props;
		const {errors} = this.state;

		try {
			await onSubmit();
		} catch (e) {
			if (!e.field) {
				this.setState({globalError: e});
			} else {
				this.setState({
					errors: {
						...(errors || {}),
						[e.field]: e
					}
				});
			}
		}
	}


	render () {
		const {className, disabled, children, ...otherProps} = this.props;
		const {errors, globalError} = this.state;

		delete otherProps.onSubmit;

		return (
			<FormContext.Provider value={{errors, clearError: this.clearError}}>
				<form
					className={cx('form', className, {disabled})}
					ref={this.form}
					onSubmit={this.onSubmit}
					noValidate
					{...otherProps}
				>
					{globalError && (<Errors.Message className={cx('form-error')} error={globalError} />)}
					{children}
				</form>
			</FormContext.Provider>
		);
	}
}
