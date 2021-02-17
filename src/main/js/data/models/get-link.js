export default function getLink(links = [], rel) {
	for (let link of links) {
		if (link.rel === rel) {
			return link.href;
		}
	}
}
