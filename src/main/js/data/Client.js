import Path from 'path';

const Default = '/';
const Servers = new Map();

class RequestError extends Error {
	constructor (info, ...args) {
		super(...args);

		Object.assign(this, info);
	}
}

class ServerInterface {
	#domain = ''

	constructor (domain) {
		this.#domain = domain;
	}

	resolveURL (path) {
		if (this.#domain === '/') { return Path.join('/', path); }

		const url = new URL(this.#domain);

		url.pathname = Path.join(url.pathname, path);

		return url.toString();
	}

	resolvePayload (data) {
		if (!data) { return {headers: {}}; }
		if (data instanceof FormData) { return {body: data, headers: {}}; }
		if (typeof data === 'object') {
			return {
				body: JSON.stringify(data),
				headers: {
					'Content-Type': 'application/json'
				}
			};
		}
	}

	async resolveResponseBody (request) {
		let body = null;

		try {
			body = await request.clone().text();
		} catch (e) {
			//swallow
		}

		try {
			if (/json/i.test(request.headers.get('content-type'))) {
				body = JSON.parse(body);
			}
		} catch (e) {
			//not JSON
		}

		return body;
	}

	async request (path, method, data, options = {}) {
		const url = this.resolveURL(path);
		const payload = this.resolvePayload(data);

		const headers = {
			'x-requested-with': 'XMLHttpRequest',
			...payload.headers,
			...(options.headers || {})
		};
		debugger;
		const request = await fetch(url, {
			mode: options.mode || 'cors',
			method,
			body: payload.body,
			headers: {
				'x-requested-with': 'XMLHttpRequest',
				...payload.headers,
				...(options.headers || {})
			}
		});

		debugger;

		const response = await this.resolveResponseBody(request, options);

		debugger;
		if (request.ok) {
			return response;
		}

		const {status} = request;

		throw new RequestError({status, ...(typeof response === 'object' ? response : {response})});
	}

	get (path, options) {
		return this.request(path, 'GET', null, options);
	}
}

export function getServer (domain = Default) {
	if (!Servers.has(domain)) {
		Servers.set(domain, new ServerInterface(domain));
	}

	return Servers.get(domain);
}
