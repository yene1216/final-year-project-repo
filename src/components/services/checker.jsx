function isImageBlurred(imageElement, threshold = 100) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = imageElement.width;
    canvas.height = imageElement.height;

    ctx.drawImage(imageElement, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const gray = [];

    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        gray.push(0.299 * r + 0.587 * g + 0.114 * b);
    }

    const laplacian = [
        0, -1, 0,
        -1, 4, -1,
        0, -1, 0
    ];

    let sum = 0;
    let sumSq = 0;
    let count = 0;

    const width = canvas.width;

    for (let y = 1; y < canvas.height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let idx = y * width + x;

            let val =
                gray[idx - width] * laplacian[1] +
                gray[idx - 1] * laplacian[3] +
                gray[idx] * laplacian[4] +
                gray[idx + 1] * laplacian[5] +
                gray[idx + width] * laplacian[7];

            sum += val;
            sumSq += val * val;
            count++;
        }
    }

    const mean = sum / count;
    const variance = (sumSq / count) - (mean * mean);

    console.log("Sharpness (variance):", variance);

    return variance < threshold; // true = blurred
}


export default isImageBlurred