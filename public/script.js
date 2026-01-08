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

// Search/filter colors by name
document.getElementById('colorSearch')?.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const colorCards = document.querySelectorAll('.color-card');
    
    colorCards.forEach(card => {
        const colorName = card.getAttribute('data-color-name').toLowerCase();
        if (colorName.includes(searchTerm)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
});
