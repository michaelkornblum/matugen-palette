// Preview image before upload
document.getElementById('fileInput')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('imagePreview');
            preview.src = e.target.result;
            document.getElementById('previewSection').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Copy to clipboard functionality
function copyToClipboard(text, name) {
    navigator.clipboard.writeText(text).then(() => {
        alert(`Copied ${text} (${name})`);
    }).catch(() => {
        alert('Failed to copy to clipboard');
    });
}
