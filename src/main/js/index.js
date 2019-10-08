import React from 'react';
import ReactDOM from 'react-dom';

function TestCmp () {
	return (
		<div>
			Hello from Javascript
		</div>
	);
}

ReactDOM.render(
	React.createElement(TestCmp),
	document.getElementById('content')
);