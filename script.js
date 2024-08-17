document.getElementById('sliceButton').addEventListener('click', () => {
    const fileInput = document.getElementById('spriteInput').files[0];
    const columns = parseInt(document.getElementById('columns').value);
    const rows = parseInt(document.getElementById('rows').value);

    if (!fileInput || columns < 1 || rows < 1) {
        alert('Please upload a sprite sheet and specify valid rows and columns.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            const frameWidth = img.width / columns;
            const frameHeight = img.height / rows;
            const frames = [];
            const previewContainer = document.getElementById('preview');
            previewContainer.innerHTML = '';

            canvas.width = frameWidth;
            canvas.height = frameHeight;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < columns; c++) {
                    ctx.clearRect(0, 0, frameWidth, frameHeight);
                    ctx.drawImage(img, c * frameWidth, r * frameHeight, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
                    const frameDataURL = canvas.toDataURL('image/png');
                    frames.push(frameDataURL);

                    const imgElement = document.createElement('img');
                    imgElement.src = frameDataURL;
                    imgElement.classList.add('frame-preview');
                    previewContainer.appendChild(imgElement);
                }
            }

            document.getElementById('downloadButton').style.display = 'block';
            document.getElementById('downloadButton').addEventListener('click', () => downloadZip(frames));
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(fileInput);
});

function downloadZip(frames) {
    const zip = new JSZip();
    frames.forEach((frame, index) => {
        const base64Data = frame.replace(/^data:image\/png;base64,/, "");
        zip.file(`frame_${index + 1}.png`, base64Data, { base64: true });
    });

    zip.generateAsync({ type: "blob" }).then(content => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'sprite_frames.zip';
        link.click();
    });
}
