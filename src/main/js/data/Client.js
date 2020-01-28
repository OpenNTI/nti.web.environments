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

	resolveURL (path, searchParams) {
		const location = this.#domain === '/' ? global.location.origin : this.#domain;
		const url = new URL(location);

		url.pathname = Path.join(url.pathname, path);

		if (searchParams) {
			for (let [key, value] of Object.entries(searchParams)) {
				url.searchParams.append(key, encodeURIComponent(value));
			}
		}

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
		const url = this.resolveURL(path, options.searchParams);
		const payload = this.resolvePayload(data);

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


		const response = await this.resolveResponseBody(request, options);

		if (request.ok) {
			return response;
		}

		const {status} = request;

		throw new RequestError({status, ...(typeof response === 'object' ? response : {response})});
	}

	get (path, options) {
		return this.request(path, 'GET', void 0, options);
	}

	post (path, data, options) {
		return this.request(path, 'POST', data, options);
	}
}

export function getServer (domain = Default) {
	if (!Servers.has(domain)) {
		Servers.set(domain, new ServerInterface(domain));
	}

	return Servers.get(domain);
}

