const getExpiryDate = () => {
	let theDate = new Date();
	theDate.setHours(theDate.getHours() + 5);
	return theDate.toISOString();
};

function startUpload(file, chunkSize, endpoint) {
	const options = {
		endpoint: endpoint,
		chunkSize: chunkSize,
		metadata: {
			expiry: getExpiryDate(),
			maxDurationSeconds: 3600,
			name: file.name,
			site: 'Anglers Planet',
			postType: 'Fishing Report',
			allowedOrigins: ['nzfishingworld.co.nz', 'www.nzfishingworld.co.nz', 'anglers-planet.webflow.io', 'anglers-planet-wip.webflow.io'],
		},
		onError(error) {
			console.error('Upload failed:', error);
		},
		onSuccess() {
			console.log('Upload finished');
			// Update the #upload-success input to true upon successful upload
			const uploadSuccessInput = document.getElementById('upload-success');
			if (uploadSuccessInput) {
				uploadSuccessInput.checked = true; // Set the checkbox to checked
				// Optionally, trigger a change event on the input if needed
				uploadSuccessInput.dispatchEvent(new Event('input', { bubbles: true }));
			}
		},
		onProgress(bytesUploaded, bytesTotal) {
			const container = document.getElementById('progress-bar-container');
			const progressBar = document.getElementById('progress-bar-fill');
			const progressBarText = document.getElementById('progress-bar-percent');
			const progress = (bytesUploaded / bytesTotal) * 100;

			container.style.display = 'block';
			progressBar.style.width = progress + '%';
			progressBarText.innerHTML = Math.floor(progress) + '% Complete';
		},
		// This function is crucial for extracting the stream-media-id
		onAfterResponse: function (req, res) {
			return new Promise((resolve) => {
				if (res.getStatus() === 204) {
					const mediaIdHeader = res.getHeader('stream-media-id');
					if (mediaIdHeader) {
						console.log('Media ID:', mediaIdHeader); // Log the media ID or use it as needed

						document.getElementById('video-id').value = mediaIdHeader; // Update the input field with the retrieved media ID
						// Create a new 'input' event
						var event = new Event('input', {
							bubbles: true,
							cancelable: true,
						});

						// Dispatch it on the hidden field
						document.getElementById('video-id').dispatchEvent(event);
					}
				}
				resolve();
			});
		},
	};

	let tusUpload = new tus.Upload(file, options);
	tusUpload.start();
}
