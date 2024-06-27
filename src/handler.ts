'use strict';
(() => {
	// src/handler.ts
	var corsHeaders = {
		'Access-Control-Allow-Headers': '*',
		'Access-Control-Expose-Headers': '*',
		'Access-Control-Allow-Methods': '*',
		'Access-Control-Allow-Origin': '*',
	};
	async function handleTusCreatorUpload(request) {
		if (request.method === 'OPTIONS' || request.method == 'HEAD') {
			return new Response('OK', {
				headers: {
					...corsHeaders,
				},
			});
		}
		const result = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/stream?direct_user=true`, {
			headers: {
				Authorization: `Bearer ${AP_UPLOAD_TOKEN}`,
				'Tus-Resumable': '1.0.0',
				'Upload-Length': request.headers.get('Upload-Length'),
				'Upload-Metadata': request.headers.get('Upload-Metadata'),
				'Upload-Creator': 'unassigned',
			},
			method: 'POST',
		});
		const destination = result.headers.get('Location');
		return new Response(null, {
			headers: {
				...corsHeaders,
				Location: destination,
			},
		});
	}

	// src/index.ts
	addEventListener('fetch', (event) => {
		event.respondWith(handleTusCreatorUpload(event.request));
	});
})();
//# sourceMappingURL=index.js.map
