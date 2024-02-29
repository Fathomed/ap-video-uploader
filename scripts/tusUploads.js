const getExpiryDate = () => {
	let theDate = new Date();
	theDate.setHours(theDate.getHours() + 5);
	return theDate.toISOString();
};

function startUpload(file, chunkSize, endpoint) {
	const fileNameInputValue = document.getElementById('file-name').value || file.name;

	const options = {
		endpoint: endpoint,
		chunkSize: chunkSize,
		metadata: {
			expiry: getExpiryDate(),
			maxDurationSeconds: 3600,
			name: fileNameInputValue, // Use the value from the input or the file name
			allowedOrigins: ['nzfishingworld.co.nz', 'www.nzfishingworld.co.nz', 'anglers-planet.webflow.io'],
		},
		onError(error) {
			console.error('Upload failed:', error);
		},
		onSuccess() {
			console.log('Upload finished');
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

						document.getElementById('vidoe-id').value = mediaIdHeader; // Update the input field with the retrieved media ID
					}
				}
				resolve();
			});
		},
	};

	let tusUpload = new tus.Upload(file, options);
	tusUpload.start();
}
