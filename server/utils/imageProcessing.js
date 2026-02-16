const sharp = require('sharp');
const path = require('path');

/**
 * Apply grayscale filter to image
 */
async function applyGrayscale(inputPath, outputPath) {
    await sharp(inputPath)
        .grayscale()
        .toFile(outputPath);
    return outputPath;
}

/**
 * Apply sepia tone filter
 */
async function applySepia(inputPath, outputPath) {
    await sharp(inputPath)
        .tint({ r: 112, g: 66, b: 20 }) // Sepia tone
        .modulate({ saturation: 0.6 })
        .toFile(outputPath);
    return outputPath;
}

/**
 * Apply blur with adjustable intensity
 */
async function applyBlur(inputPath, outputPath, intensity = 5) {
    await sharp(inputPath)
        .blur(Math.max(0.3, Math.min(1000, intensity)))
        .toFile(outputPath);
    return outputPath;
}

/**
 * Apply sharpen filter
 */
async function applySharpen(inputPath, outputPath) {
    await sharp(inputPath)
        .sharpen()
        .toFile(outputPath);
    return outputPath;
}

/**
 * Adjust brightness (-100 to 100)
 */
async function adjustBrightness(inputPath, outputPath, level = 0) {
    const brightness = 1 + (level / 100);
    await sharp(inputPath)
        .modulate({ brightness })
        .toFile(outputPath);
    return outputPath;
}

/**
 * Adjust contrast (-100 to 100)
 */
async function adjustContrast(inputPath, outputPath, level = 0) {
    const contrast = 1 + (level / 100);
    await sharp(inputPath)
        .linear(contrast, -(128 * contrast) + 128)
        .toFile(outputPath);
    return outputPath;
}

/**
 * Apply edge detection using convolution
 */
async function applyEdgeDetection(inputPath, outputPath) {
    await sharp(inputPath)
        .grayscale()
        .convolve({
            width: 3,
            height: 3,
            kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1]
        })
        .toFile(outputPath);
    return outputPath;
}

/**
 * Apply vintage effect (sepia + vignette)
 */
async function applyVintage(inputPath, outputPath) {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    await image
        .tint({ r: 112, g: 66, b: 20 })
        .modulate({ saturation: 0.5, brightness: 1.1 })
        .toFile(outputPath);

    return outputPath;
}

/**
 * Apply invert/negative effect
 */
async function applyInvert(inputPath, outputPath) {
    await sharp(inputPath)
        .negate()
        .toFile(outputPath);
    return outputPath;
}

/**
 * Apply pixelate effect
 */
async function applyPixelate(inputPath, outputPath, pixelSize = 10) {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    const smallWidth = Math.max(1, Math.floor(metadata.width / pixelSize));
    const smallHeight = Math.max(1, Math.floor(metadata.height / pixelSize));

    await image
        .resize(smallWidth, smallHeight, { kernel: 'nearest' })
        .resize(metadata.width, metadata.height, { kernel: 'nearest' })
        .toFile(outputPath);

    return outputPath;
}

/**
 * Apply anime/japanese style effect
 */
async function applyAnimeStyle(inputPath, outputPath) {
    await sharp(inputPath)
        .modulate({ saturation: 1.4, brightness: 1.1 })
        .sharpen({ sigma: 2 })
        .linear(1.2, -(128 * 1.2) + 128)
        .toFile(outputPath);
    return outputPath;
}

/**
 * Apply cartoon style effect
 */
async function applyCartoonStyle(inputPath, outputPath) {
    await sharp(inputPath)
        .modulate({ saturation: 1.3, brightness: 1.05 })
        .median(3)
        .sharpen({ sigma: 1.5 })
        .linear(1.15, -(128 * 1.15) + 128)
        .toFile(outputPath);
    return outputPath;
}

/**
 * Main processing function that routes to the appropriate filter
 */
async function processImage(inputPath, processingType, intensity = null) {
    const ext = path.extname(inputPath);
    const outputPath = inputPath.replace(ext, `_processed${ext}`);

    try {
        switch (processingType) {
            case 'grayscale':
                return await applyGrayscale(inputPath, outputPath);
            case 'sepia':
                return await applySepia(inputPath, outputPath);
            case 'blur':
                return await applyBlur(inputPath, outputPath, intensity || 5);
            case 'sharpen':
                return await applySharpen(inputPath, outputPath);
            case 'brightness':
                return await adjustBrightness(inputPath, outputPath, intensity || 20);
            case 'contrast':
                return await adjustContrast(inputPath, outputPath, intensity || 20);
            case 'edge':
                return await applyEdgeDetection(inputPath, outputPath);
            case 'vintage':
                return await applyVintage(inputPath, outputPath);
            case 'invert':
                return await applyInvert(inputPath, outputPath);
            case 'pixelate':
                return await applyPixelate(inputPath, outputPath, intensity || 10);
            case 'anime':
                return await applyAnimeStyle(inputPath, outputPath);
            case 'cartoon':
                return await applyCartoonStyle(inputPath, outputPath);
            default:
                // If no processing type or 'original', just copy the file
                return inputPath;
        }
    } catch (error) {
        console.error('Error processing image:', error);
        throw error;
    }
}

module.exports = {
    processImage,
    applyGrayscale,
    applySepia,
    applyBlur,
    applySharpen,
    adjustBrightness,
    adjustContrast,
    applyEdgeDetection,
    applyVintage,
    applyInvert,
    applyPixelate,
    applyAnimeStyle,
    applyCartoonStyle
};
