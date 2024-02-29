const corsHeaders = {
	'Access-Control-Allow-Headers': '*',
	'Access-Control-Expose-Headers': '*',
	'Access-Control-Allow-Methods': '*',
	'Access-Control-Allow-Origin': '*',
};

declare global {
	const ACCOUNT_ID: string;
	const AP_UPLOAD_TOKEN: string;
}

// if required for small or basic uploads gos here. see https://github.com/Fathomed/Cloudflare-Stream-Video-Upload

export async function handleTusCreatorUpload(request: Request): Promise<Response> {
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

export async function handleCreatorUpload(request: Request): Promise<Response> {
	return null;
}
