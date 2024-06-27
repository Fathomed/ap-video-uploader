// added to embed on pages under video select input
const selectFile = document.getElementById('file');

// Listen for the 'change' event on the file input
selectFile.addEventListener('change', (e) => {
	// Check if a file was selected
	if (selectFile.files.length > 0) {
		// Prevent default form submission behavior
		e.preventDefault();

		// Start upload via Cloudflare Workers with the selected file
		startUpload(selectFile.files[0], 5 * 1024 * 1024, 'https://ap-video-uploader.fathomstudio.workers.dev/upload');
	}
});
