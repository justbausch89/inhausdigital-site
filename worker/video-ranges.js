// Cloudflare's static assets always send the whole file, but Safari (and every iPhone browser)
// only plays a video when the server can send just the part it asks for: an HTTP range request.
// This Worker runs for /assets/video/* only (see wrangler.jsonc) and answers those requests
// with the requested bytes. Every other page and file is served by Cloudflare directly.
export default {
	async fetch(request, env) {
		const response = await env.ASSETS.fetch(request);
		const range = /^bytes=(\d*)-(\d*)$/.exec((request.headers.get('Range') || '').trim());
		const headers = new Headers(response.headers);
		headers.set('Accept-Ranges', 'bytes');
		if (request.method !== 'GET' || response.status !== 200 || !range || (range[1] === '' && range[2] === '')) {
			return new Response(response.body, {status: response.status, headers});
		}

		// The asset store doesn't say how big the file is, so read it (about 11 MB) to find out
		const file = await response.arrayBuffer();
		const size = file.byteLength;
		// "bytes=500-999", "bytes=500-" (to the end) or "bytes=-500" (the last 500 bytes)
		let start = Number(range[1]);
		let end = range[2] === '' ? size - 1 : Math.min(Number(range[2]), size - 1);
		if (range[1] === '') {
			start = Math.max(0, size - Number(range[2]));
			end = size - 1;
		}
		if (start > end) {
			return new Response(null, {status: 416, headers: {'Content-Range': `bytes */${size}`}});
		}
		headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
		return new Response(new Uint8Array(file, start, end - start + 1), {status: 206, headers});
	},
};
