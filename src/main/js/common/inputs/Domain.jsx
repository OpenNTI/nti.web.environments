import React from 'react';

import { Form } from '@nti/web-commons';

import { Domain } from '../../utils/index';

export default function DomainInput({ reservedSpace = 0, ...props }) {
	const [domain, setDomain] = React.useState('');

	return (
		<Form.Input.Text
			{...props}
			value={domain}
			onChange={value => setDomain(Domain.massageToDomain(value))}
			pattern="[a-z]([a-z0-9-]*?[a-z0-9])*?"
			maxLength={63 - reservedSpace}
		/>
	);
}
