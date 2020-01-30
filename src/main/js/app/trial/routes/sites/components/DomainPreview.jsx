import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Loading, Errors} from '@nti/web-commons';

import {Text, Inputs} from '../../../../../common';

import Styles from './DomainPreview.css';

const CheckDomainBuffer = 300;
const Checking = Symbol('Checking');

const cx = classnames.bind(Styles);

DomainPreview.propTypes = {
	domain: PropTypes.string,
	customer: PropTypes.shape({
		resolveDomain: PropTypes.func
	}).isRequired,
	onValid: PropTypes.func,
	onInvalid: PropTypes.func
};
export default function DomainPreview ({domain, customer, onValid, onInvalid}) {
	const [fullDomain, setFullDomain] = React.useState(null);
	const isChecking = fullDomain === Checking;
	const isErrored = fullDomain instanceof Error;

	const timeout = React.useRef(null);

	React.useEffect(() => {
		let unmounted = null;

		const checkDomain = async () => {
			if (unmounted) { return; }
			if (!domain) { setFullDomain(''); return; }

			try {
				const resolved = await customer.resolveDomain(domain);

				if (!unmounted) {
					setFullDomain(resolved);

					if (onValid) {
						onValid(resolved);
					}
				}
			} catch (e) {
				if (!unmounted) {
					setFullDomain(e);

					if (onInvalid) {
						onInvalid(e);
					}
				}
			}

		};

		clearTimeout(timeout.current);
		setFullDomain(Checking);
		timeout.current = setTimeout(checkDomain, CheckDomainBuffer); 

		return () => unmounted = true;
	}, [domain]);

	return (
		<div className={cx('domain-preview-container')}>
			<div className={cx('domain-preview')}>
				{!isErrored && (<Inputs.Text type="hidden" value={isChecking ? '' : (fullDomain || '')} name="dns_name" />)}
				<Loading.Placeholder loading={isChecking} fallback={(<Loading.Spinner blue />)}>
					{isErrored && (<Errors.Message error={fullDomain} />)}
					{!isErrored && (<Text.Small>{fullDomain}</Text.Small>)}
				</Loading.Placeholder>
			</div>
		</div>
	);
}