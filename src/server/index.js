/*eslint-disable no-console, strict, import/no-commonjs*/
'use strict';

const path = require('path');


let dev;
let assets = path.resolve(__dirname, '../client');

try {
	if (!/dist\/server/i.test(__dirname)) {
		dev = require('@nti/app-scripts/server/lib/devmode');
		assets = require('@nti/app-scripts/config/paths').assetsRoot;
	}
} catch (e) {
	console.error(e.stack || e.message || e);
}

exports = module.exports = {
	async register (expressApp, config) {
		const devmode = dev ? await dev.setupDeveloperMode(config) : null;

		if (devmode) {
			const proxy = require('http-proxy-middleware');

			expressApp.use(devmode.middleware); //serve in-memory compiled source/assets
			expressApp.use(
				'/onboarding',
				proxy({
					target: 'http://localhost:6543',
					xfwd: true,
					changeOrigin: true //you probably don't want this (this locks the host to "localhost:6543" on all proxied requests instead of the incoming host ie: "alpha.dev")
				})
			);
		}


		return {
			devmode,
			assets
		};
	}
};
